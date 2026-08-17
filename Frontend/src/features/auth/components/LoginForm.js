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
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
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

              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='auth-register-form'>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.email)} className='text-black'>
                  Email
                </InputLabel>
                <FormControl fullWidth sx={{ mb: 5 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        value={value}
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
                        onBlur={onBlur}
                        onChange={onChange}
                        InputProps={{
                          classes: { input: 'custom-input' }
                        }}
                        placeholder='admin@example.com'
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)} className='text-black'>
                  Password
                </InputLabel>
                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        className='custom-input'
                        value={value}
                        onBlur={onBlur}
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
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
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
                    mb: 1.75,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '& .MuiTypography-root': {
                      color: 'black !important',
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
                        icon={
                          <CheckBoxOutlineBlankIcon
                            sx={{
                              color: 'black',
                              borderRadius: '6px'
                            }}
                          />
                        }
                        checkedIcon={<CheckBoxIcon />}
                      />
                    }
                  />
                  <LinkStyled href='/forgot-password' className='text-black'>
                    Forgot Password?
                  </LinkStyled>
                </Box>
                <Button fullWidth size='large' type='submit' className='beforeLoginbtn'>
                  Login
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '10px'
                  }}
                >
                  <Typography sx={{ color: 'black', mr: 2 }}>New on our platform?</Typography>
                  <Typography variant='body2'>
                    <LinkStyled href='/register' className='text-black' sx={{ fontSize: '1rem' }}>
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
