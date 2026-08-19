import React from 'react'
import Enrolled from 'src/views/pages/components/Enrolled'
import Graduate from 'src/views/pages/components/Graduate'
import LessoinDraft from 'src/views/pages/components/LessoinDraft'
import LiveCourse from 'src/views/pages/components/LiveCourse'
import Student from 'src/views/pages/components/Student'
import TopCourse from 'src/views/pages/components/TopCourse'
import Viewership from 'src/views/pages/components/Viewership'
import { Grid } from '@mui/material'

export const EnterpriseDashboard = () => {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(JSON.parse(window.localStorage.getItem('userData')))
    }
  }, [])
  return (
    <div className='instructorwrap mb-5'>
      <h6 style={{ color: '#3a5bcd', paddingTop: '14px' }}>Hi {user?.name},</h6>

      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <LiveCourse />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Graduate />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Student />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Enrolled />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ my: 3.75 }}>
        {' '}
        <Grid item xs={12} lg={6} sx={{ pl: { xs: 0, lg: 0 } }}>
          <TopCourse />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LessoinDraft />
        </Grid>
      </Grid>

      <Grid container sx={{ mb: 6.25, mt: 3.75 }}>
        {' '}
        <Grid item xs={12} sx={{ pl: { xs: 0, lg: 0 } }}>
          <Viewership />
        </Grid>
      </Grid>
    </div>
  )
}
