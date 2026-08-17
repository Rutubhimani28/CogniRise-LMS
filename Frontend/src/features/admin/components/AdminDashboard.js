import React from 'react'
import ActiveStudents from 'src/views/pages/components/ActiveStudents'
import CorsesSuper from 'src/views/pages/components/CorsesSuper'
import EnrolledSuper from 'src/views/pages/components/EnrolledSuper'
import EnterpriseApplicants from 'src/views/pages/components/EnterpriseApplicants'
import InstructorSuper from 'src/views/pages/components/InstructorSuper'
import CoursesPendingApproval from 'src/views/pages/components/CoursesPendingApproval'
import StudentSuper from 'src/views/pages/components/StudentSuper'
import { Grid, Typography } from '@mui/material'

export const AdminDashboard = () => {
  const user = JSON.parse(window.localStorage.getItem('userData'))

  return (
    <div className='instructorwrap'>
      <Typography variant='h6' sx={{ color: '#3a5bcd', pt: { xs: "10px", sm: '0' } }}>
        Hi {user?.name},
      </Typography>
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid item xs={12} md={6} xl={3}>
          <InstructorSuper />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <CorsesSuper />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <StudentSuper />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <EnrolledSuper />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ my: 4 }} className='mt-5'>
        <Grid item xs={12} xl={6}>
          <CoursesPendingApproval />
        </Grid>
        <Grid item xs={12} xl={6}>
          <EnterpriseApplicants />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ pb: 4 }}>
        <Grid item xs={12}>
          <ActiveStudents />
        </Grid>
      </Grid>
    </div>
  )
}
