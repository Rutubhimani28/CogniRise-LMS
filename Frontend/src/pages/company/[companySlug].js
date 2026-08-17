import { ViewCompanyProfile } from 'src/features/enterprise/components/ViewCompanyProfile'

const CompanyProfilePage = () => {
  return <ViewCompanyProfile />
}

CompanyProfilePage.acl = {
  subject: 'seaAceess'
}

export default CompanyProfilePage
