import * as yup from 'yup'

export const profileSchema = yup.object({
  profileImg: yup.string(),
  name: yup.string().required('Student name is required'),
  school: yup.string().required('School name is required'),
  yearOfSchool: yup.string().required('pleace select value')
})
