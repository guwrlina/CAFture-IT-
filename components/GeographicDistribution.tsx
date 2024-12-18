'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { LeafRecord } from '../types/LeafRecord'

Chart.register(...registerables)

interface GeographicDistributionProps {
  records: LeafRecord[]
}

export default function GeographicDistribution({ records }: GeographicDistributionProps) {
  const locationDistributionRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    updateChart()
  }, [records])

  const updateChart = () => {
    const locationData: { [key: string]: number } = {}

    records.forEach(record => {
      locationData[record.location] = (locationData[record.location] || 0) + 1
    })

    const sortedLocations = Object.keys(locationData).sort((a, b) => locationData[b] - locationData[a])
    const topLocations = sortedLocations.slice(0, 10) // Show top 10 locations

    if (locationDistributionRef.current) {
      new Chart(locationDistributionRef.current, {
        type: 'bar',
        data: {
          labels: topLocations,
          datasets: [{
            label: 'Number of Cases',
            data: topLocations.map(location => locationData[location]),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Cases',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Location',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Top 10 Affected Locations',
            },
            legend: {
              display: false,
            },
          },
        },
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Geographic Distribution</h2>
      <canvas ref={locationDistributionRef}></canvas>
    </div>
  )
}

