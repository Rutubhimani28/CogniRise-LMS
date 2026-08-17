import { EnterpriseCoursesTable } from 'src/features/enterprise/components/EnterpriseCoursesTable'

const EnterpriseCourses = () => {
  return <EnterpriseCoursesTable />
}

EnterpriseCourses.acl = {
  subject: 'enterprise'
}

export default EnterpriseCourses
