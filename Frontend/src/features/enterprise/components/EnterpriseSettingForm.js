import { FormHelperText, IconButton, Input, InputAdornment, InputLabel, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Form } from 'reactstrap'
import * as yup from 'yup'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useAuth } from 'src/hooks/useAuth'

export const EnterpriseSettingForm = () => {
  const [show, setShow] = useState(true)
  const [show2, setShow2] = useState(true)
  const [show3, setShow3] = useState(true)

  const { id } = JSON.parse(window.localStorage.getItem('userData'))
  const auth = useAuth()

  const validationSchema = yup.object({
    oldPassword: yup.string().required('old password must be required'),
    password: yup
      .string()
      .required('Password required')
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
  })

  const { errors, values, handleBlur, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        id: id,
        oldPassword: values?.oldPassword,
        password: values?.password,
        confirmPassword: values?.confirmPassword
      }
      resetForm({ values: '' })
      auth.updatePassword(payload)
    }
  })

  return (
    <div>
      <h4 className='addHeadingColor'>Password</h4>
      <Form className='mt-4' onSubmit={handleSubmit}>
        <div className='row mb-3'>
          <div className='col-12 col-md-3 d-flex align-items-center'>
            <InputLabel className='text-black'>Password</InputLabel>
          </div>
          <div className='col-12 col-md-9'>
            <Input
              fullWidth
              type={show ? 'password' : 'text'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton aria-label='toggle password visibility' onClick={() => setShow(!show)}>
                    {show ? <BsEyeSlash /> : <BsEye />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                width: '100%',
                borderRadius: '5px',
                padding: '.3rem .6rem',
                backgroundColor: 'white',
                marginBottom: '1rem',
                border: '1px solid black',
                color: 'black !important',
                '& .css-10z2wft-MuiButtonBase-root-MuiIconButton-root': {
                  color: 'black !important'
                }
              }}
              value={values.oldPassword}
              name='oldPassword'
              placeholder='Password'
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.oldPassword)}
            />
            {errors.oldPassword && touched.oldPassword && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.oldPassword}</FormHelperText>
            )}
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col-12 col-md-3 d-flex align-items-center'>
            <InputLabel className='text-black'>New Password</InputLabel>
          </div>
          <div className='col-12 col-md-9'>
            <Input
              fullWidth
              type={show2 ? 'password' : 'text'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton aria-label='toggle password visibility' onClick={() => setShow2(!show2)}>
                    {show2 ? <BsEyeSlash /> : <BsEye />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                width: '100%',
                borderRadius: '5px',
                padding: '.3rem .6rem',
                backgroundColor: 'white',
                marginBottom: '1rem',
                border: '1px solid black',
                color: 'black !important',
                '& .css-10z2wft-MuiButtonBase-root-MuiIconButton-root': {
                  color: 'black !important'
                }
              }}
              value={values.password}
              name='password'
              placeholder='Password'
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.password)}
            />
            {errors.password && touched.password && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.password}</FormHelperText>
            )}
          </div>
        </div>

        <div className='row mb-3'>
          <div className='col-12 col-md-3 d-flex align-items-center'>
            <InputLabel className='text-black'>Confirm Password</InputLabel>
          </div>
          <div className='col-12 col-md-9'>
            <Input
              fullWidth
              type={show3 ? 'password' : 'text'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton aria-label='toggle password visibility' onClick={() => setShow3(!show3)}>
                    {show3 ? <BsEyeSlash /> : <BsEye />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                width: '100%',
                borderRadius: '5px',
                padding: '.3rem .6rem',
                backgroundColor: 'white',
                marginBottom: '1rem',
                border: '1px solid black',
                color: 'black !important',
                '& .css-10z2wft-MuiButtonBase-root-MuiIconButton-root': {
                  color: 'black !important'
                }
              }}
              value={values.confirmPassword}
              name='confirmPassword'
              placeholder='Confirm Password'
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword}</FormHelperText>
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col-12 d-flex justify-content-end'>
            <Button type='submit' className='beforeLoginbtn' sx={{ width: { xs: '100%', md: '75%' } }}>
              Change Password
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
