import * as yup from 'yup'

export const registerSchema1 = yup.object({
  email: yup.string().required('Email is required').email(),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password does not match')
})

export const registerSchema2 = yup.object({
  name: yup.string().required('Student name is required')
})
