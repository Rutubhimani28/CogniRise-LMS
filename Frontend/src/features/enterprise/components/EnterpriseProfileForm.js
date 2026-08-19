import { Fragment, useState, useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'
import {
  Box, Grid, Typography, Button, Card, CardContent, Avatar,
  TextField, MenuItem, Select, FormControl, InputLabel, Divider,
  InputAdornment, IconButton, CircularProgress, Tooltip
} from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import Modal from '@mui/material/Modal'
import { useDropzone } from 'react-dropzone'
import { RiUpload2Fill } from 'react-icons/ri'
import { FaTwitter, FaLinkedin, FaGlobe, FaBuilding } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500, md: 600 },
  bgcolor: 'white',
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: '12px',
  maxHeight: '90vh',
  overflowY: 'auto'
}

export const EnterpriseProfileForm = () => {
  const requestApiData = new Requests()
  const [allCategory, setAllCategory] = useState([])
  const [getData, setGetData] = useState([])
  const [files, setFiles] = useState([])
  const [tempFiles, setTempFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadImg, setUploadImg] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPhoto, setLoadingPhoto] = useState(false)
  const { user: authUser, setUser: setAuthUser } = useAuth()

  const handleUploadImgOpen = () => {
    setTempFiles(files)
    setUploadImg(true)
  }
  const handleUploadImgClose = () => {
    setTempFiles([])
    setUploadImg(false)
  }
  const handleSavePhoto = () => {
    setFiles(tempFiles)
    setUploadImg(false)
  }

  useEffect(() => {
    requestApiData.getCategories().then(res => { setAllCategory(res.data) }).catch(err => console.log(err))
  }, [])

  const userApi = () => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData.getUserById(createdBy.id).then(res => {
      if (res?.status === 200) setGetData(res.data)
    })
  }

  useEffect(() => { userApi() }, [])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    onDrop: acceptedFiles => {
      setTempFiles(acceptedFiles.map(file => Object.assign(file)))
      setSelectedFile(acceptedFiles[0])
    }
  })

  const img = tempFiles.map(file => (
    <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} width='100px' height='100px' />
  ))

  const uploadFile = async file => {
    try {
      setLoadingPhoto(true)
      const formData = new FormData()
      formData.append('profile', file)
      formData.append('_id', getData._id)
      if (getData.profile) {
        Object.keys(getData.profile).forEach(key => {
          if (key !== 'profileImg') formData.append(`profile[${key}]`, getData.profile[key])
        })
      }
      const res = await requestApiData.updateUserProfile(formData)
      if (res?.status === 200) {
        toast.success('Profile picture updated successfully')
        setGetData(res.data)
        setFiles([])

        // Update user context and localStorage
        if (authUser) {
          const updatedUser = { ...authUser, profile: { ...authUser.profile, profileImg: res.data.profile?.profileImg } }
          setAuthUser(updatedUser)
          window.localStorage.setItem('userData', JSON.stringify(updatedUser))
        }

        userApi()
        setUploadImg(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoadingPhoto(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: getData?.email || '',
      name: getData?.profile?.name || '',
      companySlug: getData?.profile?.companySlug || '',
      employeeSize: getData?.profile?.employeeSize || '',
      industryVerticale: getData?.profile?.industryVerticale || '',
      companyType: getData?.profile?.companyType || '',
      foundingDate: getData?.profile?.foundingDate || '',
      description: getData?.profile?.description || '',
      twitter: getData?.profile?.twitter || '',
      linkedin: getData?.profile?.linkedin || '',
      website: getData?.profile?.website || ''
    },
    enableReinitialize: true,
    onSubmit: values => {
      setLoadingProfile(true)

      let requestPromise;

      if (files.length > 0) {
        const formData = new FormData()
        formData.append('profile', files[0])
        formData.append('_id', getData._id)
        formData.append('email', getData.email)

        const profileData = {
          name: values.name,
          companySlug: values.companySlug,
          employeeSize: values.employeeSize,
          industryVerticale: values.industryVerticale,
          companyType: values.companyType,
          foundingDate: values.foundingDate,
          description: values.description,
          twitter: values.twitter,
          linkedin: values.linkedin,
          website: values.website
        }

        Object.keys(profileData).forEach(key => {
          formData.append(`profile[${key}]`, profileData[key] || '')
        })

        requestPromise = requestApiData.updateUserProfile(formData)
      } else {
        const payload = {
          _id: getData._id,
          email: getData.email,
          profile: {
            name: values.name,
            companySlug: values.companySlug,
            profileImg: getData?.profile?.profileImg,
            employeeSize: values.employeeSize,
            industryVerticale: values.industryVerticale,
            companyType: values.companyType,
            foundingDate: values.foundingDate,
            description: values.description,
            twitter: values.twitter,
            linkedin: values.linkedin,
            website: values.website
          }
        }
        requestPromise = requestApiData.updateUserProfile(payload)
      }

      requestPromise
        .then(res => {
          if (res?.status === 200) {
            toast.success('Profile updated successfully')
            setGetData(res.data)
            if (authUser) {
              const updatedUser = { ...authUser, profile: { ...authUser.profile, name: values.name } }
              if (files.length > 0) {
                updatedUser.profile.profileImg = res.data.profile?.profileImg
                setFiles([])
              }
              setAuthUser(updatedUser)
              window.localStorage.setItem('userData', JSON.stringify(updatedUser))
            }
          }
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setLoadingProfile(false))
    }
  })

  const avatarLetter = getData?.profile?.name?.charAt(0)?.toUpperCase() || getData?.email?.charAt(0)?.toUpperCase() || 'E'

  if (!getData || getData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7d9b17' }} size={60} thickness={4} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', mt: 0 }}>
      <Card elevation={0} sx={{ border: '1px solid rgba(47, 43, 61, 0.12)', borderRadius: 2 }}>
        <CardContent sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <Box component='form' onSubmit={formik.handleSubmit}>

            <Grid container spacing={4}>
              {/* Column 1: Profile Picture & Socials */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D' }}>Enterprise Profile</Typography>
                  <Typography variant='body2' color='text.secondary'>Manage your company information and preferences</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box onClick={handleUploadImgOpen} sx={{ cursor: 'pointer', position: 'relative', mb: 2 }}>
                    {files.length > 0 ? (
                      <Avatar src={URL.createObjectURL(files[0])} sx={{ width: 120, height: 120, border: '3px solid #7d9b17' }} />
                    ) : getData?.profile?.profileImg ? (
                      <Avatar src={getData.profile.profileImg + '?' + new Date().getTime()} sx={{ width: 120, height: 120, border: '3px solid #7d9b17' }} />
                    ) : (
                      <Avatar sx={{ width: 120, height: 120, bgcolor: '#7d9b17', fontSize: '3rem', fontWeight: 700 }}>{avatarLetter}</Avatar>
                    )}
                    <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#7d9b17', color: 'white', borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                      <MdEdit size={16} />
                    </Box>
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 700, color: '#2F2B3D' }}>{getData?.profile?.name || 'Company Name'}</Typography>
                  <Typography variant='body2' sx={{ color: '#7d9b17' }}>{getData?.email}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 2, color: '#2F2B3D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Social Links</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Twitter' name='twitter' value={formik.values.twitter} onChange={formik.handleChange} InputProps={{ startAdornment: <InputAdornment position='start'><FaTwitter color='#1DA1F2' /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label='LinkedIn' name='linkedin' value={formik.values.linkedin} onChange={formik.handleChange} InputProps={{ startAdornment: <InputAdornment position='start'><FaLinkedin color='#0A66C2' /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Website' name='website' value={formik.values.website} onChange={formik.handleChange} InputProps={{ startAdornment: <InputAdornment position='start'><FaGlobe color='#7d9b17' /></InputAdornment> }} />
                  </Grid>
                </Grid>
              </Grid>

              {/* Column 2: Company Details */}
              <Grid item xs={12} md={8}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2, color: '#2F2B3D' }}>Company Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Company Name' name='name' value={formik.values.name} onChange={formik.handleChange} InputProps={{ startAdornment: <InputAdornment position='start'><FaBuilding color='#7d9b17' /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Company Email' name='email' value={formik.values.email} onChange={formik.handleChange} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Company Slug' name='companySlug' value={formik.values.companySlug} onChange={formik.handleChange} helperText={formik.values.companySlug ? `URL: /company/${formik.values.companySlug}` : ''} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Founding Date' name='foundingDate' type='date' value={formik.values.foundingDate} onChange={formik.handleChange} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Employee Size</InputLabel>
                      <Select name='employeeSize' value={formik.values.employeeSize} onChange={formik.handleChange} label='Employee Size'>
                        <MenuItem value='1-10'>1–10</MenuItem>
                        <MenuItem value='11-50'>11–50</MenuItem>
                        <MenuItem value='51-1000'>51–1000</MenuItem>
                        <MenuItem value='1000+'>1000+</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Industry Vertical</InputLabel>
                      <Select name='industryVerticale' value={formik.values.industryVerticale} onChange={formik.handleChange} label='Industry Vertical'>
                        {allCategory && allCategory.map((item, index) => (
                          <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Company Type</InputLabel>
                      <Select name='companyType' value={formik.values.companyType} onChange={formik.handleChange} label='Company Type'>
                        <MenuItem value='Profit'>Profit</MenuItem>
                        <MenuItem value='Non-Profit'>Non-Profit</MenuItem>
                        <MenuItem value='Blockchain Ecosystem'>Blockchain Ecosystem</MenuItem>
                        <MenuItem value='DAO'>DAO</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Company Description' name='description' multiline rows={4} value={formik.values.description} onChange={formik.handleChange} />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Tooltip title={(!formik.dirty && files.length === 0) ? "Make changes to enable saving" : ""} placement="top" arrow>
                    <span>
                      <Button type='submit' variant='contained' size='large' disabled={loadingProfile || (!formik.dirty && files.length === 0)} sx={{ px: 6, py: 1.5, bgcolor: '#7d9b17', borderRadius: 2, fontWeight: 600, textTransform: 'none', fontSize: '1rem', minWidth: '180px', position: 'relative', '&:hover': { bgcolor: '#6b8514' } }}>
                        {loadingProfile && <CircularProgress size={24} color="inherit" sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
                        <span style={{ opacity: loadingProfile ? 0 : 1 }}>Save Changes</span>
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

          </Box>
        </CardContent>
      </Card>

      {/* Upload Image Modal */}
      <Modal open={uploadImg} onClose={handleUploadImgClose}>
        <Box sx={modalStyle}>
          <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 700, color: '#7d9b17', pb: 3 }}>
            Upload Profile Photo
          </Typography>

          <Box
            {...getRootProps({ className: 'dropzone' })}
            sx={{
              border: '2px dashed #7d9b17', borderRadius: 2, p: 4,
              minHeight: tempFiles.length ? 250 : 150,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', textAlign: 'center', cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(79, 70, 229,0.04)' }
            }}
          >
            <input {...getInputProps()} />
            {tempFiles.length ? img : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <RiUpload2Fill size={40} color='#7d9b17' />
                <Typography variant='body1' color='text.secondary'>
                  Choose a file or drag and drop it here
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Supported: JPG, PNG • Max: 5 MB
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3 }}>
            <Button variant='outlined' onClick={handleUploadImgClose} disabled={loadingPhoto} sx={{ borderColor: '#7d9b17', color: '#7d9b17', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSavePhoto} disabled={loadingPhoto || tempFiles.length === 0} sx={{ bgcolor: '#7d9b17', textTransform: 'none', '&:hover': { bgcolor: '#6b8514' } }}>
              {loadingPhoto ? <CircularProgress size={24} color="inherit" /> : 'Save Photo'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

