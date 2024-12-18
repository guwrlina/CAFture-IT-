'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Student, LeafCapture } from '@/types/user'
import StudentTable from '@/components/StudentTable'
import StudentProgress from '@/components/StudentProgress'
import CaptureMap from '@/components/CaptureMap'

const DEFAULT_CENTER = { lat: 0, lng: 0 }

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [captures, setCaptures] = useState<LeafCapture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch this data from your API
    const mockStudents: Student[] = [
      {
        id: '1',
        userId: '2',
        name: 'John Doe',
        studentId: 'STU001',
        leafCaptureCount: 15,
        lastActive: new Date(),
        progress: 75,
        createdAt: new Date()
      },
      // Add more mock students
    ]

    const mockCaptures: LeafCapture[] = [
      {
        id: '1',
        studentId: 'STU001',
        plantName: 'Oak',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'New York, NY'
        },
        diseaseDetected: 'Leaf Spot',
        confidence: 0.95,
        imageUrl: '/placeholder.svg',
        capturedAt: new Date()
      },
      // Add more mock captures
    ]

    setStudents(mockStudents)
    setCaptures(mockCaptures)
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <div className="text-sm text-gray-500">Total Students</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leaf Captures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{captures.length}</div>
            <div className="text-sm text-gray-500">Total Captures</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentTable students={students} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capture Locations</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <CaptureMap captures={captures} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentProgress students={students} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

