import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, Chip, Menu, MenuItem, IconButton, Divider } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const allNavLinks = [
    // Admin Links
    { label: 'Enterprises', href: '/admin-enterprises', subject: 'admin' },
    { label: 'Courses', href: '/admin-courses', subject: 'admin' },
    { label: 'Categories', href: '/admin-category', subject: 'admin' },
    // Enterprise Links
    { label: 'Dashboard', href: '/enterprise', subject: 'enterprise' },
    { label: 'My Courses', href: '/enterprise-courses', subject: 'enterprise' },
    { label: 'Create Course', href: '/course-creation', subject: 'enterprise' },
    { label: 'Profile', href: '/enterprise-profile', subject: 'enterprise' },
    // Student Links
    { label: 'All Courses', href: '/Course-listing', subject: 'student' },
    { label: 'Student Profile', href: '/student-profile', subject: 'student' },
    { label: 'Settings', href: '/student-setting', subject: 'student' },
  ]

  const navLinks = user && ability ? allNavLinks.filter(link => ability.can('manage', link.subject)) : []

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: user?.role === 'admin' ? '100vh' : 'auto',
        minHeight: '100vh',
        overflow: user?.role === 'admin' ? 'hidden' : 'visible',
        backgroundColor: '#F4F5FA'
      }}
    >
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
                href={user?.role === 'admin' ? '/admin-enterprises' : user?.role === 'enterprise' ? '/enterprise' : '/student'}
                sx={{
                  textDecoration: 'none',
                  color: '#7d9b17',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  letterSpacing: '0.5px'
                }}
              >
                Eduvanza - LMS
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

                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    sx={{ ml: 1, padding: 0.5, borderRadius: '8px' }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={user?.profile?.profileImg || user?.profileImg ? (user?.profile?.profileImg || user?.profileImg) + '?' + new Date().getTime() : ''}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#7d9b17',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {!user?.profile?.profileImg && !user?.profileImg && (user?.name || user?.email || 'U')[0].toUpperCase()}
                      </Avatar>
                      <Typography variant='body2' sx={{ color: '#2F2B3D', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                        {user.name || user.email}
                      </Typography>
                    </Box>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        minWidth: 150,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },

                    }}
                  >
                    <MenuItem sx={{ pointerEvents: 'none', display: 'flex', justifyContent: 'center', pb: 1.5 }}>
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
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout} sx={{ color: '#d32f2f', fontWeight: 600, justifyContent: 'center' }}>
                      Logout
                    </MenuItem>
                  </Menu>
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
            </Box >
          </Toolbar >
        </Container >
      </AppBar >

      <Box component='main' sx={{ flexGrow: 1, py: 2, overflowY: user?.role === 'admin' ? 'auto' : 'visible' }}>
        <Container maxWidth='xl'>{children}</Container>
      </Box>
    </Box >
  )
}

export default AppLayout
