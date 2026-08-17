import { AdminDashboard } from 'src/features/admin/components/AdminDashboard'

const SuperAdmin = () => {
  return <AdminDashboard />
}

SuperAdmin.acl = {
  subject: 'admin'
}

export default SuperAdmin
