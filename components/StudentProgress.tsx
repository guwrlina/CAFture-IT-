'use client'

import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import { Student } from '@/types/user'

interface StudentProgressProps {
  students: Student[]
}

export default function StudentProgress({ students }: StudentProgressProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: students.map(student => student.name),
            datasets: [{
              label: 'Progress',
              data: students.map(student => student.progress),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        })
      }
    }
  }, [students])

  return <canvas ref={chartRef} />
}

