import BlankLayout from 'src/@core/layouts/BlankLayout'
import { ForgotPasswordForm } from 'src/features/auth/components/ForgotPasswordForm'

const ForgotPassword = () => {
  return <ForgotPasswordForm />
}

ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
