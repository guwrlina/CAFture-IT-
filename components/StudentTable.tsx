import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  import { Student } from '@/types/user'
  
  interface StudentTableProps {
    students: Student[]
  }
  
  export default function StudentTable({ students }: StudentTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Leaf Captures</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.leafCaptureCount}</TableCell>
              <TableCell>{student.progress}%</TableCell>
              <TableCell>{student.lastActive.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  