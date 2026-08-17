import { EnterpriseProfileForm } from 'src/features/enterprise/components/EnterpriseProfileForm'

const ProfileEnterprise = () => {
  return <EnterpriseProfileForm />
}

ProfileEnterprise.acl = {
  subject: 'enterprise'
}

export default ProfileEnterprise
