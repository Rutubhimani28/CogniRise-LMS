import { AdminCategoryTable } from 'src/features/admin/components/AdminCategoryTable'

const AdminCategory = () => {
  return <AdminCategoryTable />
}

AdminCategory.acl = {
  subject: 'admin'
}

export default AdminCategory
