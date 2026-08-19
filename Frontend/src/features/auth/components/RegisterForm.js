import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import { MenuItem, Select, Tooltip } from '@mui/material'

import imgConst from 'src/configs/imgConst'

import { useFormik } from 'formik'
import Requests from 'src/configs/axiosRequest'
import { registerSchema1, registerSchema2 } from '../schemas/registerSchema'

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export const RegisterForm = () => {
  const requestApiData = new Requests()

  const [allCategory, setAllCategory] = useState([])
  const [show1, setShow1] = useState(true)
  const [show, setShow] = useState(false)
  const [formValue, setFormValue] = useState([])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    requestApiData
      .getCategories()
      .then(res => {
        setAllCategory(res.data)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const { settings } = useSettings()

  const { skin } = settings

  const handleBack = () => {
    setShow1(true)
    setShow(false)
  }

  const formik1 = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    enableReinitialize: true,
    validationSchema: registerSchema1,
    onSubmit: values => {
      setFormValue(values)
      setShow(true)
      setShow1(false)
    }
  })

  const formik2 = useFormik({
    initialValues: {
      profile: {
        name: '',
        graduation: '',
        profileSlug: '',
        major: '',
        minor: '',
        university: '',
        location: '',
        interests: '',
        expLevel: '',
        twitter: '',
        linkedin: ''
      }
    },
    enableReinitialize: true,
    validationSchema: registerSchema2,
    onSubmit: values => {
      const payload = {
        ...formValue,
        role: 'student',
        profile: {
          name: values?.name,
          graduation: values?.graduation,
          profileSlug: values?.profileSlug,
          major: values?.major,
          minor: values?.minor,
          university: values?.university,
          location: values?.location,
          interests: values?.interests,
          expLevel: values?.expLevel,
          twitter: values?.twitter,
          linkedin: values?.linkedin
        }
      }
      router.push('/profile/student')
      auth.register(payload)
    }
  })

  return (
    <div className='login-page'>
      {show1 && (
        <Box className='login-wrap'>
          <RightWrapper>
            <Box
              sx={{
                p: [4, 6],
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <div className='pb-5 d-flex align-items-center justify-content-center w-100'>
                  <img src={imgConst.mainLogo} alt='LOGO' className='text-black' width={'80px'} height={'80px'} />
                </div>

                <form noValidate autoComplete='off' onSubmit={formik1.handleSubmit} className='auth-register-form'>
                  <InputLabel htmlFor='register-email' error={Boolean(formik1.errors.email && formik1.touched.email)} sx={{ color: '#333', mb: 1, fontWeight: 500 }}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                      size='small'
                      autoFocus
                      name='email'
                      id='register-email'
                      value={formik1.values.email}
                      className='custom-input'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: '#7d9b17',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#7d9b17',
                            borderWidth: '2px',
                          },
                        }
                      }}
                      onBlur={formik1.handleBlur}
                      onChange={formik1.handleChange}
                      InputProps={{
                        classes: { input: 'custom-input' }
                      }}
                      placeholder='john@example.edu'
                      error={Boolean(formik1.errors.email && formik1.touched.email)}
                    />
                    {formik1.errors.email && formik1.touched.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>{formik1.errors.email}</FormHelperText>
                    )}
                  </FormControl>

                  <InputLabel htmlFor='register-password' error={Boolean(formik1.errors.password && formik1.touched.password)} sx={{ color: '#333', mb: 1, fontWeight: 500 }}>
                    Password <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <OutlinedInput
                      size='small'
                      name='password'
                      id='register-password'
                      className='custom-input'
                      value={formik1.values.password}
                      onBlur={formik1.handleBlur}
                      onChange={formik1.handleChange}
                      sx={{
                        borderRadius: '8px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7d9b17',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7d9b17',
                          borderWidth: '2px',
                        },
                      }}
                      error={Boolean(formik1.errors.password && formik1.touched.password)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      inputProps={{
                        className: 'custom-input'
                      }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formik1.errors.password && formik1.touched.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>{formik1.errors.password}</FormHelperText>
                    )}
                  </FormControl>

                  <InputLabel htmlFor='register-confirmpassword' error={Boolean(formik1.errors.confirmPassword && formik1.touched.confirmPassword)} sx={{ color: '#333', mb: 1, fontWeight: 500 }}>
                    Confirm Password <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <OutlinedInput
                      size='small'
                      name='confirmPassword'
                      id='register-confirmpassword'
                      className='custom-input'
                      value={formik1.values.confirmPassword}
                      onBlur={formik1.handleBlur}
                      onChange={formik1.handleChange}
                      sx={{
                        borderRadius: '8px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7d9b17',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#7d9b17',
                          borderWidth: '2px',
                        },
                      }}
                      error={Boolean(formik1.errors.confirmPassword && formik1.touched.confirmPassword)}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm Password'
                      inputProps={{
                        className: 'custom-input'
                      }}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <Icon icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formik1.errors.confirmPassword && formik1.touched.confirmPassword && (
                      <FormHelperText sx={{ color: 'error.main' }}>{formik1.errors.confirmPassword}</FormHelperText>
                    )}
                  </FormControl>

                  <Tooltip title={!(formik1.isValid && formik1.dirty) ? "Fill all required fields to proceed" : ""} placement="top" arrow>
                    <span>
                      <Button
                        fullWidth
                        size='large'
                        type='submit'
                        variant='contained'
                        disabled={!(formik1.isValid && formik1.dirty)}
                        sx={{
                          backgroundColor: '#7d9b17',
                          color: 'white',
                          borderRadius: '8px',
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                          '&:hover': {
                            backgroundColor: '#4338ca',
                            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)'
                          }
                        }}
                      >
                        Next
                      </Button>
                    </span>
                  </Tooltip>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginTop: '24px'
                    }}
                  >
                    <Typography sx={{ color: '#555', mr: 1 }}>If you already have an account?</Typography>
                    <Typography variant='body2'>
                      <LinkStyled href='/login' sx={{ color: '#7d9b17 !important', fontWeight: 600, fontSize: '1rem' }}>
                        Sign In
                      </LinkStyled>
                    </Typography>
                  </Box>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      )}

      {show && (
        <Box className='login-wrap' sx={{ height: 'auto', maxHeight: '95vh', overflowY: 'auto', width: '100%', maxWidth: '850px', p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant='h5' sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
              Profile Details
            </Typography>

            <form noValidate autoComplete='off' onSubmit={formik2.handleSubmit} className='auth-register-form'>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Name <span style={{ color: 'red' }}>*</span></InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='name'
                      value={formik2.values.name || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                      error={Boolean(formik2.errors.name && formik2.touched.name)}
                    />
                    {formik2.errors.name && formik2.touched.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>{formik2.errors.name}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Graduation</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='graduation'
                      value={formik2.values.graduation || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Profile Slug</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='profileSlug'
                      value={formik2.values.profileSlug || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                    <FormHelperText sx={{ color: '#555' }}>
                      Profile Link: https://collegedao.io/person/{formik2.values.profileSlug}
                    </FormHelperText>
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Major</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='major'
                      value={formik2.values.major || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Minor</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='minor'
                      value={formik2.values.minor || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>University</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='university'
                      value={formik2.values.university || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Location</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='location'
                      value={formik2.values.location || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Interests</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      name='interests'
                      value={formik2.values.interests || ''}
                      onChange={formik2.handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: '8px',
                        color: 'black',
                        backgroundColor: 'white',
                        '.MuiSelect-icon': { color: 'black' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17', borderWidth: '2px' }
                      }}
                    >
                      {allCategory &&
                        allCategory.map((item, index) => (
                          <MenuItem key={index} value={item.name} sx={{ color: 'black' }}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Experience Level</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='expLevel'
                      value={formik2.values.expLevel || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>Twitter</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='twitter'
                      value={formik2.values.twitter || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <InputLabel sx={{ color: '#333', mb: 0.5, fontWeight: 500 }}>LinkedIn</InputLabel>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      name='linkedin'
                      value={formik2.values.linkedin || ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                      onChange={formik2.handleChange}
                    />
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button
                  size='medium'
                  variant='outlined'
                  onClick={handleBack}
                  sx={{
                    borderColor: '#7d9b17',
                    color: '#7d9b17',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#4338ca',
                      backgroundColor: 'rgba(79, 70, 229, 0.04)'
                    }
                  }}
                >
                  Back
                </Button>
                <Tooltip title={!(formik2.isValid && formik2.dirty) ? "Fill all required fields to submit" : ""} placement="top" arrow>
                  <span>
                    <Button
                      size='medium'
                      type='submit'
                      variant='contained'
                      disabled={!(formik2.isValid && formik2.dirty)}
                      sx={{
                        backgroundColor: '#7d9b17',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                        '&:hover': {
                          backgroundColor: '#4338ca',
                          boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)'
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </div>
  )
}
