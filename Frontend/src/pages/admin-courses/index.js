import { AdminCoursesTable } from 'src/features/admin/components/AdminCoursesTable'

const AdminCourses = () => {
  return <AdminCoursesTable />
}

AdminCourses.acl = {
  subject: 'admin'
}

export default AdminCourses
