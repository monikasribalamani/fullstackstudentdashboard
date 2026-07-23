import { Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Students } from '@/pages/Students'
import { AddStudent } from '@/pages/AddStudent'
import { EditStudent } from '@/pages/EditStudent'
import { StudentDetails } from '@/pages/StudentDetails'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/new" element={<AddStudent />} />
        <Route path="/students/:studentId" element={<StudentDetails />} />
        <Route path="/students/:studentId/edit" element={<EditStudent />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
