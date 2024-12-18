'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CameraCapture from '@/components/CameraCapture'
import LeafHistory from '@/components/LeafHistory'

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [captures, setCaptures] = useState([])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Capture New Leaf</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraCapture 
              studentId={session?.user?.studentId as string}
              onCapture={(capture) => setCaptures([...captures, capture])}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{captures.length}</div>
            <div className="text-sm text-gray-500">Total Captures</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Capture History</CardTitle>
        </CardHeader>
        <CardContent>
          <LeafHistory captures={captures} />
        </CardContent>
      </Card>
    </div>
  )
}

