import BlankLayout from 'src/@core/layouts/BlankLayout'
import { LandingPageView } from 'src/features/landing/components/LandingPageView'

const LandingPage = () => {
  return <LandingPageView />
}

LandingPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LandingPage.guestGuard = true

export default LandingPage
