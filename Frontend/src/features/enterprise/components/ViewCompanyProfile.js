import { Fragment, useState, useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'
import { Box, Grid, Typography, Avatar, Chip, Card, CardContent, Divider } from '@mui/material'
import { useRouter } from 'next/router'
import { FaTwitter, FaLinkedin, FaGlobe, FaBuilding, FaUsers, FaCalendarAlt, FaIndustry } from 'react-icons/fa'
import Link from 'next/link'

export const ViewCompanyProfile = () => {
  const requestApiData = new Requests()
  const router = useRouter()
  const [getData, setGetData] = useState(null)

  useEffect(() => {
    if (!router.isReady) return
    const params = { 'profile.companySlug': router?.query?.companySlug }
    requestApiData.getUser(params).then(res => {
      if (res?.status === 200) setGetData(res.data[0])
    })
  }, [router.isReady])

  if (!getData) return null

  const avatarLetter = getData?.profile?.name?.charAt(0)?.toUpperCase() || 'E'

  return (
    <Fragment>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>

        {/* Hero Card */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8e8e8', mb: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>

              {/* Avatar */}
              {getData?.profile?.profileImg ? (
                <Avatar
                  src={getData.profile.profileImg}
                  alt={getData?.profile?.name}
                  sx={{ width: 100, height: 100, border: '3px solid #7d9b17', flexShrink: 0 }}
                />
              ) : (
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#7d9b17', fontSize: '2.5rem', fontWeight: 700, flexShrink: 0 }}>
                  {avatarLetter}
                </Avatar>
              )}

              {/* Company Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#2F2B3D', mb: 0.5 }}>
                  {getData?.profile?.name}
                </Typography>
                <Typography variant='body1' sx={{ color: '#7d9b17', mb: 1.5 }}>
                  {getData?.email}
                </Typography>

                {/* Chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {getData?.profile?.companyType && (
                    <Chip
                      label={getData.profile.companyType}
                      size='small'
                      sx={{ bgcolor: 'rgba(125,155,23,0.1)', color: '#7d9b17', fontWeight: 600, borderRadius: 1 }}
                    />
                  )}
                  {getData?.profile?.industryVerticale && (
                    <Chip
                      label={getData.profile.industryVerticale}
                      size='small'
                      variant='outlined'
                      sx={{ borderColor: '#7d9b17', color: '#7d9b17', borderRadius: 1 }}
                    />
                  )}
                  {getData?.profile?.employeeSize && (
                    <Chip
                      icon={<FaUsers size={12} />}
                      label={`${getData.profile.employeeSize} Employees`}
                      size='small'
                      sx={{ bgcolor: '#f5f5f5', color: '#555', borderRadius: 1 }}
                    />
                  )}
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {getData?.profile?.twitter && (
                    <Link href={getData.profile.twitter} target='_blank' rel='noopener noreferrer'
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: '#e8f5fe' }}>
                      <FaTwitter color='#1DA1F2' size={18} />
                    </Link>
                  )}
                  {getData?.profile?.linkedin && (
                    <Link href={getData.profile.linkedin} target='_blank' rel='noopener noreferrer'
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: '#e8f0fe' }}>
                      <FaLinkedin color='#0A66C2' size={18} />
                    </Link>
                  )}
                  {getData?.profile?.website && (
                    <Link href={getData.profile.website} target='_blank' rel='noopener noreferrer'
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(125,155,23,0.1)' }}>
                      <FaGlobe color='#7d9b17' size={18} />
                    </Link>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* About Card */}
        {getData?.profile?.description && (
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8e8e8', mb: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#2F2B3D', mb: 1 }}>
                About
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant='body1' sx={{ color: '#4B465C', lineHeight: 1.8 }}>
                {getData.profile.description}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Details Card */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8e8e8' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#2F2B3D', mb: 1 }}>
              Company Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {getData?.profile?.industryVerticale && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(125,155,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaIndustry color='#7d9b17' size={18} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Industry Vertical</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: '#2F2B3D' }}>
                        {getData.profile.industryVerticale}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {getData?.profile?.employeeSize && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(125,155,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaUsers color='#7d9b17' size={18} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Company Size</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: '#2F2B3D' }}>
                        {getData.profile.employeeSize} Employees
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {getData?.profile?.companyType && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(125,155,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaBuilding color='#7d9b17' size={18} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Company Type</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: '#2F2B3D' }}>
                        {getData.profile.companyType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {getData?.profile?.foundingDate && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(125,155,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCalendarAlt color='#7d9b17' size={18} />
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Founded</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: '#2F2B3D' }}>
                        {getData.profile.foundingDate}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

      </Box>
    </Fragment>
  )
}
