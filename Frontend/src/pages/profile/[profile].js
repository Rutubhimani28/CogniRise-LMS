import BlankLayout from 'src/@core/layouts/BlankLayout'
import { ProfileForm } from 'src/features/profile/components/ProfileForm'

const Profile = () => {
  return <ProfileForm />
}

Profile.acl = {
  subject: 'student'
}

Profile.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Profile
