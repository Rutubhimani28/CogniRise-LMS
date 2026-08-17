import UserLayout from 'src/layouts/UserLayout'
import { AddCategoryForm } from 'src/features/admin/components/AddCategoryForm'

const AddCategory = () => {
  return <AddCategoryForm />
}

AddCategory.getLayout = page => {
  return <UserLayout>{page}</UserLayout>
}

AddCategory.acl = {
  subject: 'admin'
}

export default AddCategory
