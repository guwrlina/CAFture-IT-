export type UserRole = 'admin' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  studentId?: string
}

export interface Student {
  id: string
  userId: string
  name: string
  studentId: string
  leafCaptureCount: number
  lastActive: Date
  progress: number
  createdAt: Date
}

export interface LeafCapture {
  id: string
  studentId: string
  plantName: string
  location: {
    lat: number
    lng: number
    address: string
  }
  diseaseDetected: string
  confidence: number
  imageUrl: string
  capturedAt: Date
}

