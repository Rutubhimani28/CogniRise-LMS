import UserLayout from 'src/layouts/UserLayout'
import { CourseListingCatalog } from 'src/features/courses/components/CourseListingCatalog'

const CourseListing = () => {
  return <CourseListingCatalog />
}

CourseListing.getLayout = page => <UserLayout>{page}</UserLayout>
CourseListing.acl = {
  subject: 'student'
}

export default CourseListing
