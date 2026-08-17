import BlankLayout from 'src/@core/layouts/BlankLayout'
import { LoginForm } from 'src/features/auth/components/LoginForm'

const LoginPage = () => {
  return <LoginForm />
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
