import { LeafRecord } from '../types/LeafRecord'

interface LeafRecordsTableProps {
  records: LeafRecord[]
}

export default function LeafRecordsTable({ records }: LeafRecordsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Leaf Disease Report</h2>
      <p className="mb-4 italic text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Disease ID</th>
            <th className="border p-2">Leaf Name</th>
            <th className="border p-2">Disease Name</th>
            <th className="border p-2">Severity</th>
            <th className="border p-2">Progress</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="border p-2">{record.date}</td>
              <td className="border p-2">{record.diseaseId}</td>
              <td className="border p-2">{record.leafName}</td>
              <td className="border p-2">{record.diseaseName}</td>
              <td className={`border p-2 ${getSeverityColor(record.severity)}`}>{record.severity}</td>
              <td className={`border p-2 ${getProgressColor(record.progress)}`}>{record.progress}</td>
              <td className="border p-2">{record.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'low':
      return 'text-green-600'
    case 'medium':
      return 'text-yellow-600'
    case 'high':
      return 'text-red-600'
    default:
      return ''
  }
}

function getProgressColor(progress: string) {
  switch (progress.toLowerCase()) {
    case 'improving':
      return 'text-green-600'
    case 'stable':
      return 'text-blue-600'
    case 'worsening':
      return 'text-red-600'
    default:
      return ''
  }
}

