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
import { MenuItem, Select } from '@mui/material'

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
                p: [6, 12],
                height: '100%',
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
                  <InputLabel htmlFor='register-email' error={Boolean(formik1.errors.email && formik1.touched.email)} className='text-black'>
                    Email
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField
                      autoFocus
                      name='email'
                      id='register-email'
                      value={formik1.values.email}
                      className='custom-input'
                      sx={{
                        border: '1px solid black',
                        borderRadius: '5px',
                        '& input': {
                          color: 'black'
                        },
                        '& input:focus': {
                          color: 'black'
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

                  <InputLabel htmlFor='register-password' error={Boolean(formik1.errors.password && formik1.touched.password)} className='text-black'>
                    Password
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <OutlinedInput
                      name='password'
                      id='register-password'
                      className='custom-input'
                      value={formik1.values.password}
                      onBlur={formik1.handleBlur}
                      onChange={formik1.handleChange}
                      sx={{
                        border: '1px solid black',
                        borderRadius: '5px',
                        '& input': {
                          color: 'black'
                        },
                        '& input:focus': {
                          color: 'black'
                        }
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

                  <InputLabel htmlFor='register-confirmpassword' error={Boolean(formik1.errors.confirmPassword && formik1.touched.confirmPassword)} className='text-black'>
                    Confirm Password
                  </InputLabel>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <OutlinedInput
                      name='confirmPassword'
                      id='register-confirmpassword'
                      className='custom-input'
                      value={formik1.values.confirmPassword}
                      onBlur={formik1.handleBlur}
                      onChange={formik1.handleChange}
                      sx={{
                        border: '1px solid black',
                        borderRadius: '5px',
                        '& input': {
                          color: 'black'
                        },
                        '& input:focus': {
                          color: 'black'
                        }
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

                  <Button fullWidth size='large' type='submit' className='beforeLoginbtn'>
                    Next
                  </Button>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginTop: '20px'
                    }}
                  >
                    <Typography sx={{ color: 'black', mr: 2 }}>If you already have an account?</Typography>
                    <Typography variant='body2'>
                      <LinkStyled href='/login' className='text-black' sx={{ fontSize: '1rem' }}>
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
        <Box className='login-wrap' sx={{ height: 'auto', maxHeight: '90vh', overflowY: 'auto', width: '700px', py: 4 }}>
          <RightWrapper sx={{ maxWidth: '100% !important' }}>
            <Box
              sx={{
                p: [4, 8],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant='h5' className='text-black mb-4' sx={{ fontWeight: 'bold' }}>
                  Profile Details
                </Typography>

                <form noValidate autoComplete='off' onSubmit={formik2.handleSubmit} className='auth-register-form'>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                    <Box>
                      <InputLabel className='text-black'>Name</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='name'
                          value={formik2.values.name || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
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
                      <InputLabel className='text-black'>Graduation</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='graduation'
                          value={formik2.values.graduation || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <InputLabel className='text-black'>Profile Slug</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='profileSlug'
                          value={formik2.values.profileSlug || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                        <FormHelperText sx={{ color: 'black' }}>
                          Profile Link: https://collegedao.io/person/{formik2.values.profileSlug}
                        </FormHelperText>
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Major</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='major'
                          value={formik2.values.major || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Minor</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='minor'
                          value={formik2.values.minor || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>University</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='university'
                          value={formik2.values.university || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Location</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='location'
                          value={formik2.values.location || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Interests</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name='interests'
                          value={formik2.values.interests || ''}
                          onChange={formik2.handleChange}
                          displayEmpty
                          sx={{
                            border: '1px solid black',
                            borderRadius: '5px',
                            color: 'black',
                            backgroundColor: 'white',
                            '.MuiSelect-icon': { color: 'black' },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                          }}
                        >
                          {allCategory &&
                            allCategory.map((item, index) => (
                              <MenuItem key={index} value={item.name} className='text-black'>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Experience Level</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='expLevel'
                          value={formik2.values.expLevel || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                      <Typography variant='h6' className='text-black mb-2'>
                        Social accounts
                      </Typography>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>Twitter</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='twitter'
                          value={formik2.values.twitter || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>

                    <Box>
                      <InputLabel className='text-black'>LinkedIn</InputLabel>
                      <FormControl fullWidth>
                        <TextField
                          name='linkedin'
                          value={formik2.values.linkedin || ''}
                          className='custom-input'
                          sx={{ border: '1px solid black', borderRadius: '5px', '& input': { color: 'black' } }}
                          onChange={formik2.handleChange}
                        />
                      </FormControl>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                    <Button size='large' className='beforeLoginbtn' onClick={handleBack}>
                      Back
                    </Button>
                    <Button size='large' type='submit' className='beforeLoginbtn'>
                      Submit
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      )}
    </div>
  )
}

