import BlankLayout from 'src/@core/layouts/BlankLayout'
import { RegisterForm } from 'src/features/auth/components/RegisterForm'

const RegisterPage = () => {
  return <RegisterForm />
}

RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
RegisterPage.guestGuard = true

export default RegisterPage
