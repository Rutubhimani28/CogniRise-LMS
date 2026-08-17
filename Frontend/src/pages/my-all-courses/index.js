import { StudentEnrolledCourses } from 'src/features/courses/components/StudentEnrolledCourses'

const MyAllCourses = () => {
  return <StudentEnrolledCourses />
}

MyAllCourses.acl = {
  subject: 'student'
}

export default MyAllCourses
