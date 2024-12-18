import { NextResponse } from 'next/server'
import { LeafRecord } from '../../../types/LeafRecord'

let leafRecords: LeafRecord[] = [
  {
    date: '2023-06-01',
    diseaseId: 'D001',
    leafName: 'Oak',
    diseaseName: 'Leaf Spot',
    severity: 'Low',
    progress: 'Improving',
    location: 'North Garden',
    latitude: 40.7128,
    longitude: -74.0060,
    temperature: 22,
    humidity: 65,
    soilMoisture: 40,
    lightIntensity: 5000
  },
  {
    date: '2023-06-03',
    diseaseId: 'D002',
    leafName: 'Maple',
    diseaseName: 'Powdery Mildew',
    severity: 'Medium',
    progress: 'Stable',
    location: 'East Orchard',
    latitude: 34.0522,
    longitude: -118.2437,
    temperature: 25,
    humidity: 70,
    soilMoisture: 35,
    lightIntensity: 6000
  },
  {
    date: '2023-06-05',
    diseaseId: 'D003',
    leafName: 'Pine',
    diseaseName: 'Needle Blight',
    severity: 'High',
    progress: 'Worsening',
    location: 'South Forest',
    latitude: 41.8781,
    longitude: -87.6298,
    temperature: 20,
    humidity: 75,
    soilMoisture: 50,
    lightIntensity: 4500
  },
]

export async function GET() {
  return NextResponse.json(leafRecords)
}

export async function POST(req: Request) {
  const newRecord: LeafRecord = await req.json()
  leafRecords.push(newRecord)
  return NextResponse.json({ message: 'Record added successfully' }, { status: 201 })
}

