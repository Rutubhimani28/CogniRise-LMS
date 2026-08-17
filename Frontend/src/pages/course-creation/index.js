import UserLayout from 'src/layouts/UserLayout'
import { CourseCreationForm } from 'src/features/course-builder/components/CourseCreationForm'

const CourseCreation = () => {
  return <CourseCreationForm />
}

CourseCreation.getLayout = page => {
  return <UserLayout>{page}</UserLayout>
}

CourseCreation.acl = {
  subject: 'enterprise'
}

export default CourseCreation
