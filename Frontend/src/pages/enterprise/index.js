import UserLayout from 'src/layouts/UserLayout'
import { EnterpriseDashboard } from 'src/features/enterprise/components/EnterpriseDashboard'

const Enterprise = () => {
  return <EnterpriseDashboard />
}

Enterprise.getLayout = page => {
  return <UserLayout customBG='customebg'>{page}</UserLayout>
}

Enterprise.acl = {
  subject: 'enterprise'
}

export default Enterprise
