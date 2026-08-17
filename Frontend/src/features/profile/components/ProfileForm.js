import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Requests from 'src/configs/axiosRequest'
import { profileSchema } from '../schemas/profileSchema'

export const ProfileForm = () => {
  const [updateId, setUpdateId] = useState('')
  const [getData, setGetData] = useState(null)
  const router = useRouter()
  const requestApiData = new Requests()

  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    if (!createdBy?.id) return

    requestApiData.getStudentProfile().then(res => {
      if (res?.status === 200) {
        const filteredItem = res.data?.find(item => item.createdBy === createdBy.id)
        if (filteredItem) {
          setGetData(filteredItem)
          setUpdateId(filteredItem._id)
        }
      }
    }).catch(err => console.error(err))
  }, [])

  const formik = useFormik({
    initialValues: {
      name: getData?.name || '',
      school: getData?.school || '',
      yearOfSchool: getData?.yearOfSchool || '',
      bio: getData?.bio || '',
      twitter: getData?.socialLink?.twitter || '',
      discord: getData?.socialLink?.discord || ''
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        school: values.school,
        yearOfSchool: values.yearOfSchool,
        bio: values.bio,
        twitter: values.twitter,
        discord: values.discord
      }
      try {
        const res = await requestApiData.studentProfile(payload)
        if (res?.status === 200) {
          toast.success('Profile updated successfully')
          router.push('/student')
        }
      } catch (err) {
        toast.error('Failed to update profile')
      }
    }
  })

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Card elevation={0} sx={{ border: '1px solid rgba(47, 43, 61, 0.12)', borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D' }}>Enterprise Profile Details</Typography>}
          subheader={<Typography variant='body2' color='text.secondary'>Manage your company public profile information</Typography>}
        />
        <Divider sx={{ mb: 4 }} />
        
        <CardContent>
          <Box component='form' onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label='Company / Enterprise Name' 
                  name='name' 
                  value={formik.values.name} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label='School / Affiliation' 
                  name='school' 
                  value={formik.values.school} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                  error={formik.touched.school && Boolean(formik.errors.school)}
                  helperText={formik.touched.school && formik.errors.school}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.yearOfSchool && Boolean(formik.errors.yearOfSchool)}>
                  <InputLabel>Year of Establishment</InputLabel>
                  <Select 
                    name='yearOfSchool' 
                    value={formik.values.yearOfSchool} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur}
                    label='Year of Establishment'
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='Freshman'>Startup (&lt; 1 Year)</MenuItem>
                    <MenuItem value='Sophomore'>Early Stage (1-3 Years)</MenuItem>
                    <MenuItem value='Masters'>Growth Stage (3-5 Years)</MenuItem>
                    <MenuItem value='PhD'>Established (5+ Years)</MenuItem>
                    <MenuItem value='Professor'>Enterprise</MenuItem>
                  </Select>
                  {formik.touched.yearOfSchool && formik.errors.yearOfSchool && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {formik.errors.yearOfSchool}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  multiline
                  rows={4}
                  label='Company Bio / Description' 
                  name='bio' 
                  value={formik.values.bio} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Social Accounts</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label='Twitter / X Handle' 
                  name='twitter' 
                  value={formik.values.twitter} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FaTwitter color="#1DA1F2" /></InputAdornment> }} 
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label='Discord Invite Link' 
                  name='discord' 
                  value={formik.values.discord} 
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FaDiscord color="#5865F2" /></InputAdornment> }} 
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button variant='contained' color='primary' type='submit' size='large' sx={{ px: 5, fontWeight: 700 }}>
                  Save Enterprise Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProfileForm
