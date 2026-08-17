import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CourseListingCatalog } from 'src/features/courses/components/CourseListingCatalog'

const CourseListing = () => {
  return <CourseListingCatalog />
}

CourseListing.getLayout = page => <BlankLayout>{page}</BlankLayout>
CourseListing.acl = {
  subject: 'student'
}

export default CourseListing
