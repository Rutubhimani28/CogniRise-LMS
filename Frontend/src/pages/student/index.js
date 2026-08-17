import React from 'react'
import UserLayout from 'src/layouts/UserLayout'
import { StudentDashboard } from 'src/features/student/components/StudentDashboard'

const Student = () => {
  return <StudentDashboard />
}

Student.getLayout = page => {
  return <UserLayout customBG='customebg'>{page}</UserLayout>
}

Student.acl = {
  subject: 'student'
}

export default Student
