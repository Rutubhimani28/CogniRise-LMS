import BlankLayout from 'src/@core/layouts/BlankLayout'
import { EnterpriseRegisterForm } from 'src/features/enterprise/components/EnterpriseRegisterForm'

const EnterpriseRegister = () => {
  return <EnterpriseRegisterForm />
}

EnterpriseRegister.getLayout = page => <BlankLayout>{page}</BlankLayout>
EnterpriseRegister.guestGuard = true

export default EnterpriseRegister
