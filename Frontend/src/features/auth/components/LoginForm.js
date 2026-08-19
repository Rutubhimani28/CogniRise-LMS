import { useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Icon from 'src/@core/components/icon'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import imgConst from 'src/configs/imgConst'
import { loginSchema } from '../schemas/loginSchema'

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

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const defaultValues = {
  password: '',
  email: ''
}

export const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = data => {
    setIsSubmitting(true)
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setIsSubmitting(false)
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  return (
    <div className='login-page'>
      <Box className='login-wrap'>
        <RightWrapper>
          <Box
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <div className='pb-4 d-flex align-items-center justify-content-center w-100'>
                <img src={imgConst.mainLogo} alt='LOGO' className='text-black' width={'100px'} height={'100px'} />
              </div>

              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='auth-register-form'>
                <InputLabel htmlFor='auth-login-v2-email' error={Boolean(errors.email)} sx={{ color: '#333', mb: 1, fontWeight: 500 }}>
                  Email
                </InputLabel>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        value={value}
                        id='auth-login-v2-email'
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder='admin@example.com'
                        error={Boolean(errors.email)}
                        disabled={isSubmitting}
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
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>

                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)} sx={{ color: '#333', mb: 1, fontWeight: 500 }}>
                  Password
                </InputLabel>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        disabled={isSubmitting}
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
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '& .MuiTypography-root': {
                      color: '#555 !important',
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  <FormControlLabel
                    label='Remember Me'
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#ccc',
                          '&.Mui-checked': {
                            color: '#7d9b17',
                          },
                        }}
                      />
                    }
                  />
                  <LinkStyled href='/forgot-password' sx={{ color: '#7d9b17 !important', fontWeight: 500 }}>
                    Forgot Password?
                  </LinkStyled>
                </Box>

                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={isSubmitting}
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
                  {isSubmitting ? <CircularProgress size={24} color='inherit' /> : 'Login'}
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '24px'
                  }}
                >
                  <Typography sx={{ color: '#555', mr: 1 }}>New on our platform?</Typography>
                  <Typography variant='body2'>
                    <LinkStyled href='/register' sx={{ color: '#7d9b17 !important', fontWeight: 600, fontSize: '1rem' }}>
                      Create an account
                    </LinkStyled>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </div>
  )
}
