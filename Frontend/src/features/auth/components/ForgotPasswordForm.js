import Link from 'next/link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import imgConst from 'src/configs/imgConst'

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

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
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

export const ForgotPasswordForm = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
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
            <img src={imgConst.mainLogo} alt='logo' className='text-black' width={'80px'} height={'80px'} />
            <Box sx={{ my: 6 }}>
              <Typography
                sx={{ mb: 1.5, fontWeight: 700, fontSize: '1.625rem', lineHeight: 1.385, color: '#333' }}
              >
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: '#555' }}>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <TextField
                autoFocus
                type='email'
                placeholder='Enter Email'
                sx={{
                  display: 'flex',
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#7d9b17',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7d9b17',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'black !important'
                  }
                }}
              />
              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                sx={{
                  mb: 4,
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
                Send reset link
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login' sx={{ color: '#7d9b17 !important', fontWeight: 600 }}>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
