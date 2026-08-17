import { EnterpriseProfileForm } from 'src/features/enterprise/components/EnterpriseProfileForm'

const EnterpriseProfile = () => {
  return <EnterpriseProfileForm />
}

EnterpriseProfile.acl = {
  subject: 'enterprise'
}

export default EnterpriseProfile
