'use client'

import { useState, useRef, useEffect } from 'react'
import { LeafRecord } from '../types/LeafRecord'
import CameraComponent from './CameraComponent'
import LeafRecordsTable from './LeafRecordsTable'
import DiseaseAnalysis from './DiseaseAnalysis'
import HistoricalTrends from './HistoricalTrends'
import GeographicDistribution from './GeographicDistribution'

export default function LeafDiseaseDetection() {
  const [leafRecords, setLeafRecords] = useState<LeafRecord[]>([])

  useEffect(() => {
    // Load initial data
    fetchLeafRecords()
  }, [])

  const fetchLeafRecords = async () => {
    try {
      const response = await fetch('/api/leaf-records')
      const data = await response.json()
      setLeafRecords(data)
    } catch (error) {
      console.error('Error fetching leaf records:', error)
    }
  }

  const addLeafRecord = async (record: LeafRecord) => {
    try {
      const response = await fetch('/api/leaf-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })
      if (response.ok) {
        setLeafRecords([...leafRecords, record])
      }
    } catch (error) {
      console.error('Error adding leaf record:', error)
    }
  }

  return (
    <div className="space-y-8">
      <CameraComponent addLeafRecord={addLeafRecord} />
      <LeafRecordsTable records={leafRecords} />
      <DiseaseAnalysis records={leafRecords} />
      <HistoricalTrends records={leafRecords} />
      <GeographicDistribution records={leafRecords} />
    </div>
  )
}

