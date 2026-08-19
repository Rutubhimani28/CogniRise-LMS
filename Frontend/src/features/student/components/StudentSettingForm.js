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
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useAuth } from 'src/hooks/useAuth'

export const StudentSettingForm = () => {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const payload = {
        id: id,
        oldPassword: values?.oldPassword,
        password: values?.password,
        confirmPassword: values?.confirmPassword
      }
      try {
        await auth.updatePassword(payload)
        resetForm()
      } finally {
        setLoading(false)
      }
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Tooltip title={!formik.dirty ? "Make changes to enable updating" : ""} placement="bottom" arrow>
                  <span>
                    <Button variant='contained' color='primary' type='submit' size='large' disabled={loading || !formik.dirty} sx={{ px: 4, fontWeight: 700, minWidth: '180px', position: 'relative' }}>
                      {loading && <CircularProgress size={24} color="inherit" sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
                      <span style={{ opacity: loading ? 0 : 1 }}>Update Password</span>
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StudentSettingForm
