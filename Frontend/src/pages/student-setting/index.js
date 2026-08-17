import { StudentSettingForm } from 'src/features/student/components/StudentSettingForm'

const StudentSetting = () => {
  return <StudentSettingForm />
}

StudentSetting.acl = {
  subject: 'student'
}

export default StudentSetting
