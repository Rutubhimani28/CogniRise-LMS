import { AdminEnterprisesTable } from 'src/features/admin/components/AdminEnterprisesTable'

const AdminEnterprises = () => {
  return <AdminEnterprisesTable />
}

AdminEnterprises.acl = {
  subject: 'admin'
}

export default AdminEnterprises
