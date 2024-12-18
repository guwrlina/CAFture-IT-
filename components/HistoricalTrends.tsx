'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { LeafRecord } from '../types/LeafRecord'

Chart.register(...registerables)

interface HistoricalTrendsProps {
  records: LeafRecord[]
}

export default function HistoricalTrends({ records }: HistoricalTrendsProps) {
  const monthlyTrendsRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    updateChart()
  }, [records])

  const updateChart = () => {
    const monthlyData: { [key: string]: { count: number; diseases: { [key: string]: number } } } = {}

    records.forEach(record => {
      const month = record.date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, diseases: {} }
      }
      monthlyData[month].count++
      monthlyData[month].diseases[record.diseaseName] = (monthlyData[month].diseases[record.diseaseName] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyData).sort()
    const datasets = Object.keys(monthlyData[sortedMonths[0]].diseases).map(disease => ({
      label: disease,
      data: sortedMonths.map(month => monthlyData[month].diseases[disease] || 0),
      borderColor: getRandomColor(),
      fill: false,
    }))

    if (monthlyTrendsRef.current) {
      new Chart(monthlyTrendsRef.current, {
        type: 'line',
        data: {
          labels: sortedMonths,
          datasets: datasets,
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
                text: 'Month',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Monthly Disease Trends',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      })
    }
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Historical Trends</h2>
      <canvas ref={monthlyTrendsRef}></canvas>
    </div>
  )
}

