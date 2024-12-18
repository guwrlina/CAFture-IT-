'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { LeafCapture } from '@/types/user'

interface CameraCaptureProps {
  studentId: string
  onCapture: (capture: LeafCapture) => void
}

export default function CameraCapture({ studentId, onCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      setCapturing(true)
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        
        try {
          // Get current location
          const position = await getCurrentPosition()
          
          // Detect disease using Roboflow API
          const response = await fetch('/api/detect-disease', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
          })

          const result = await response.json()
          
          if (result.predictions && result.predictions.length > 0) {
            const prediction = result.predictions[0]
            
            const capture: LeafCapture = {
              id: Date.now().toString(),
              studentId,
              plantName: 'Unknown Plant',
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: await getAddressFromCoords(position.coords)
              },
              diseaseDetected: prediction.class,
              confidence: prediction.confidence,
              imageUrl: imageData,
              capturedAt: new Date()
            }

            onCapture(capture)
          }
        } catch (error) {
          console.error('Error processing capture:', error)
        }
      }
      setCapturing(false)
    }
  }

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  const getAddressFromCoords = async (coords: GeolocationCoordinates): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      return data.results[0]?.formatted_address || 'Unknown location'
    } catch (error) {
      console.error('Error getting address:', error)
      return 'Unknown location'
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex gap-4">
        {!stream ? (
          <Button onClick={startCamera}>Start Camera</Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="outline">Stop Camera</Button>
            <Button 
              onClick={captureImage} 
              disabled={capturing}
            >
              {capturing ? 'Processing...' : 'Capture & Analyze'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

