import BlankLayout from 'src/@core/layouts/BlankLayout'
import { EmailVerificationHandler } from 'src/features/auth/components/EmailVerificationHandler'

const EmailVerification = () => {
  return <EmailVerificationHandler />
}

EmailVerification.getLayout = page => <BlankLayout>{page}</BlankLayout>
EmailVerification.guestGuard = true

export default EmailVerification
