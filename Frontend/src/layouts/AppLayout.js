import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, Chip } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const getNavLinks = () => {
    if (!user) return []
    if (user.role === 'admin') {
      return [
        { label: 'Enterprises', href: '/admin-enterprises' },
        { label: 'Courses', href: '/admin-courses' },
        { label: 'Categories', href: '/admin-category' }
      ]
    }
    if (user.role === 'enterprise') {
      return [
        { label: 'Dashboard', href: '/enterprise' },
        { label: 'My Courses', href: '/enterprise/courses' },
        { label: 'Create Course', href: '/course-creation' },
        { label: 'Profile', href: '/enterprise-profile' }
      ]
    }
    return [
      { label: 'All Courses', href: '/my-all-courses' },
      { label: 'Student Profile', href: '/student-profile' },
      { label: 'Settings', href: '/student-setting' }
    ]
  }

  const navLinks = getNavLinks()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F5FA' }}>
      <AppBar
        position='sticky'
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(47, 43, 61, 0.12)',
          boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.05)'
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
            {/* Logo & Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography
                variant='h6'
                component={Link}
                href={user?.role === 'admin' ? '/admin-enterprises' : user?.role === 'enterprise' ? '/enterprise' : '/my-all-courses'}
                sx={{
                  textDecoration: 'none',
                  color: '#7d9b17',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  letterSpacing: '0.5px'
                }}
              >
                College DAO Academy
              </Typography>

              {/* Navigation Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {navLinks.map(link => {
                  const isActive = router.pathname === link.href
                  return (
                    <Button
                      key={link.href}
                      component={Link}
                      href={link.href}
                      sx={{
                        color: isActive ? '#7d9b17' : '#4B465C',
                        backgroundColor: isActive ? 'rgba(125, 155, 23, 0.12)' : 'transparent',
                        fontWeight: isActive ? 700 : 500,
                        '&:hover': {
                          backgroundColor: 'rgba(125, 155, 23, 0.08)',
                          color: '#7d9b17'
                        }
                      }}
                    >
                      {link.label}
                    </Button>
                  )
                })}
              </Box>
            </Box>

            {/* Right Action Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Chip
                    label={user.role?.toUpperCase() || 'USER'}
                    color='primary'
                    size='small'
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 24,
                      backgroundColor: 'rgba(125, 155, 23, 0.12)',
                      color: '#7d9b17',
                      border: '1px solid rgba(125, 155, 23, 0.3)'
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#7d9b17',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}
                    >
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </Avatar>
                    <Typography variant='body2' sx={{ color: '#2F2B3D', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                      {user.name || user.email}
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    onClick={logout}
                    sx={{
                      borderColor: 'rgba(125, 155, 23, 0.5)',
                      color: '#7d9b17',
                      '&:hover': {
                        borderColor: '#7d9b17',
                        backgroundColor: 'rgba(125, 155, 23, 0.08)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} href='/login' variant='text' sx={{ color: '#4B465C' }}>
                    Login
                  </Button>
                  <Button component={Link} href='/register' variant='contained' color='primary'>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component='main' sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth='xl'>{children}</Container>
      </Box>
    </Box>
  )
}

export default AppLayout
