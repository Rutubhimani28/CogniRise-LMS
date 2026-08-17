import { EnterpriseSettingForm } from 'src/features/enterprise/components/EnterpriseSettingForm'

const EnterpriseSetting = () => {
  return <EnterpriseSettingForm />
}

EnterpriseSetting.acl = {
  subject: 'enterprise'
}

export default EnterpriseSetting
