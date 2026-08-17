import React from 'react'
import UserLayout from 'src/layouts/UserLayout'
import { CourseViewer } from 'src/features/courses/components/CourseViewer'

const StudentCourse = () => {
  return <CourseViewer />
}

StudentCourse.getLayout = page => {
  return <UserLayout>{page}</UserLayout>
}

StudentCourse.acl = {
  subject: 'seaAceess'
}

export default StudentCourse
