'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { LeafRecord } from '../types/LeafRecord'

Chart.register(...registerables)

interface DiseaseAnalysisProps {
  records: LeafRecord[]
}

export default function DiseaseAnalysis({ records }: DiseaseAnalysisProps) {
  const diseaseDistributionRef = useRef<HTMLCanvasElement>(null)
  const severityTrendRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    updateCharts()
  }, [records])

  const updateCharts = () => {
    const diseaseCounts: { [key: string]: number } = {}
    const severityTrend: { [key: string]: { count: number; total: number } } = {}

    records.forEach(record => {
      diseaseCounts[record.diseaseName] = (diseaseCounts[record.diseaseName] || 0) + 1
      severityTrend[record.date] = severityTrend[record.date] || { count: 0, total: 0 }
      severityTrend[record.date].count++
      severityTrend[record.date].total += ['Low', 'Medium', 'High'].indexOf(record.severity) + 1
    })

    updateDiseaseDistributionChart(diseaseCounts)
    updateSeverityTrendChart(severityTrend)
  }

  const updateDiseaseDistributionChart = (diseaseCounts: { [key: string]: number }) => {
    if (diseaseDistributionRef.current) {
      new Chart(diseaseDistributionRef.current, {
        type: 'pie',
        data: {
          labels: Object.keys(diseaseCounts),
          datasets: [{
            data: Object.values(diseaseCounts),
            backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Disease Distribution'
            },
            legend: {
              position: 'right',
            },
          },
        },
      })
    }
  }

  const updateSeverityTrendChart = (severityTrend: { [key: string]: { count: number; total: number } }) => {
    const sortedDates = Object.keys(severityTrend).sort()
    const averageSeverities = sortedDates.map(date => severityTrend[date].total / severityTrend[date].count)

    if (severityTrendRef.current) {
      new Chart(severityTrendRef.current, {
        type: 'line',
        data: {
          labels: sortedDates,
          datasets: [{
            label: 'Average Severity',
            data: averageSeverities,
            borderColor: '#3498db',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 3,
              ticks: {
                callback: function(value) {
                  return ['Low', 'Medium', 'High'][Math.floor(value as number) - 1]
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Severity Trend Over Time'
            }
          }
        }
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Disease Analysis</h2>
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-[48%] mb-4">
          <canvas ref={diseaseDistributionRef}></canvas>
        </div>
        <div className="w-full md:w-[48%] mb-4">
          <canvas ref={severityTrendRef}></canvas>
        </div>
      </div>
    </div>
  )
}

