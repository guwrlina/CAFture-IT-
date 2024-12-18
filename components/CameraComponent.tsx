'use client'

import { useState, useRef } from 'react'
import { LeafRecord } from '../types/LeafRecord'

interface CameraComponentProps {
  addLeafRecord: (record: LeafRecord) => void
}

export default function CameraComponent({ addLeafRecord }: CameraComponentProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing the camera:', err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'))
      }
    }
  }

  const diagnoseDisease = async () => {
    if (capturedImage) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/detect-disease', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: capturedImage }),
        })

        const result = await response.json()
        console.log('Disease detection result:', result)

        if (result.predictions && result.predictions.length > 0) {
          const prediction = result.predictions[0]
          const newRecord: LeafRecord = {
            date: new Date().toISOString().split('T')[0],
            diseaseId: `D${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            leafName: 'Unknown',
            diseaseName: prediction.class,
            severity: getSeverity(prediction.confidence),
            progress: 'New',
            location: 'Camera',
          }

          addLeafRecord(newRecord)
        } else {
          console.log('No disease detected')
        }
      } catch (error) {
        console.error('Error calling disease detection API:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getSeverity = (confidence: number): 'Low' | 'Medium' | 'High' => {
    if (confidence > 0.8) return 'High'
    if (confidence > 0.5) return 'Medium'
    return 'Low'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Capture Leaf Image</h2>
      <div className="mb-4">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl mx-auto mb-4 rounded-lg" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {capturedImage && (
          <img src={capturedImage} alt="Captured leaf" className="w-full max-w-2xl mx-auto mb-4 rounded-lg" />
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Start Camera
        </button>
        <button onClick={captureImage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          Capture Image
        </button>
        <button 
          onClick={diagnoseDisease} 
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          disabled={isLoading || !capturedImage}
        >
          {isLoading ? 'Diagnosing...' : 'Diagnose Disease'}
        </button>
      </div>
    </div>
  )
}

