'use client'

import { useEffect, useRef } from 'react'
import { LeafCapture } from '@/types/user'
import { Loader } from '@googlemaps/js-api-loader'

interface CaptureMapProps {
  captures: LeafCapture[]
}

export default function CaptureMap({ captures }: CaptureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      })

      const google = await loader.load()
      
      if (mapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
        })

        // Add markers for each capture
        captures.forEach(capture => {
          new google.maps.Marker({
            position: { lat: capture.location.lat, lng: capture.location.lng },
            map: googleMapRef.current,
            title: `${capture.plantName} - ${capture.diseaseDetected}`,
          })
        })
      }
    }

    initMap()
  }, [captures])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}

