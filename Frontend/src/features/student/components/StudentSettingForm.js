import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Grid,
  Divider
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useAuth } from 'src/hooks/useAuth'

export const StudentSettingForm = () => {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const userData = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userData')) : null
  const id = userData?.id
  const auth = useAuth()

  const validationSchema = yup.object({
    oldPassword: yup.string().required('Current password is required'),
    password: yup
      .string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: yup
      .string()
      .required('Please confirm your new password')
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  })

  const formik = useFormik({
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
      resetForm()
      auth.updatePassword(payload)
    }
  })

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}>
      <Card elevation={0} sx={{ border: '1px solid rgba(47, 43, 61, 0.12)', borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D' }}>Security & Password Settings</Typography>}
          subheader={<Typography variant='body2' color='text.secondary'>Update your account password to secure your account</Typography>}
        />
        <Divider sx={{ mb: 2 }} />
        <CardContent>
          <Box component='form' onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Current Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='oldPassword'
                  name='oldPassword'
                  label='Current Password'
                  type={showOld ? 'text' : 'password'}
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                  helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowOld(!showOld)} edge='end'>
                          {showOld ? <BsEye /> : <BsEyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* New Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='password'
                  name='password'
                  label='New Password'
                  type={showNew ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowNew(!showNew)} edge='end'>
                          {showNew ? <BsEye /> : <BsEyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='confirmPassword'
                  name='confirmPassword'
                  label='Confirm New Password'
                  type={showConfirm ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowConfirm(!showConfirm)} edge='end'>
                          {showConfirm ? <BsEye /> : <BsEyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant='contained' color='primary' type='submit' size='large' sx={{ px: 4, fontWeight: 700 }}>
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StudentSettingForm
