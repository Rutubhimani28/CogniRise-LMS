import React, { useState, useEffect } from 'react'
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import { RiUpload2Fill } from 'react-icons/ri'
import { AiOutlineGoogle } from 'react-icons/ai'
import { CiWallet } from 'react-icons/ci'
import { FaPlus, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/router'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import Requests from 'src/configs/axiosRequest'

export const StudentProfileForm = () => {
  const requestApiData = new Requests()
  const router = useRouter()
  
  const [allCategory, setAllCategory] = useState([])
  const [getData, setGetData] = useState(null)
  const [files, setFiles] = useState([])
  const [uploadImgOpen, setUploadImgOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [logoutDialog, setLogoutDialog] = useState(false)
  const [emaildata, setEmaildata] = useState('')
  const [showloginButton, setShowloginButton] = useState(true)
  const [loading, setLoading] = useState(false)

  // Fetch Categories
  useEffect(() => {
    requestApiData.getCategories().then(res => setAllCategory(res.data)).catch(err => console.error(err))
  }, [])

  // Fetch User Data
  const userApi = () => {
    const userData = JSON.parse(window.localStorage.getItem('userData'))
    if (!userData?.id) return
    requestApiData.getUserById(userData.id).then(res => {
      if (res?.status === 200) setGetData(res.data)
    })
  }

  useEffect(() => { userApi() }, [])

  // Wallet Logic
  useEffect(() => {
    currentwalletconnected()
    addwalletlistener()
  }, [])

  const connectWallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        if (getData?.profile?.wallet) {
          toast.success(`You are already logged in as this account`)
        }
      } catch (error) {
        console.log(error.message)
        toast.error("wallet_requestPermissions' already pending")
      }
    } else {
      window.open('https://metamask.io/', '_blank')
    }
  }

  const currentwalletconnected = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  }

  const addwalletlistener = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      window.ethereum.on('accountsChanged', accounts => {
        setWalletAddress(accounts[0])
        const createdBy = JSON.parse(window.localStorage.getItem('userData'))
        requestApiData.getUserById(createdBy.id).then(res => {
          if (res?.status === 200) {
            fetchWalletUpdate(res.data, accounts[0])
          }
        })
      })
    } else {
      setWalletAddress('')
      console.log('Please install metamask')
    }
  }

  const fetchWalletUpdate = (userDataObj, walletad) => {
    const payload = {
      _id: userDataObj._id,
      profile: {
        ...userDataObj.profile,
        wallet: walletad == undefined ? '' : walletad
      }
    }
    requestApiData.updateUserProfile(payload).then(res => {
      if (res?.status === 200) {
        userApi()
        toast.success('User updated successfully')
      }
    }).catch(err => {
      toast.error('Something went wrong')
      console.log(err)
    })
  }

  // Google Login Logic
  const loginwithgoogle = useGoogleLogin({
    onSuccess: codeResponse => setEmaildata(codeResponse.access_token)
  })

  useEffect(() => {
    if (emaildata.length > 0) {
      axios({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        method: 'get',
        headers: { Authorization: `Bearer ${emaildata}` }
      }).then(function (response) {
        let email = response.data.email
        fetchlogin(getData, email)
      })
    }
  }, [emaildata])

  function fetchlogin(userDataObj, email) {
    const payload = {
      _id: userDataObj._id,
      profile: {
        ...userDataObj.profile,
        email: email
      }
    }
    requestApiData.updateUserProfile(payload).then(res => {
      if (res?.status === 200) {
        userApi()
        toast.success('Profile updated successfully')
      }
    }).catch(err => {
      toast.error('Something went wrong')
      console.log(err)
    })
    setShowloginButton(false)
  }

  function fetchlogout(userDataObj, email) {
    const payload = {
      _id: userDataObj._id,
      profile: {
        ...userDataObj.profile,
        email: email
      }
    }
    requestApiData.updateUserProfile(payload).then(res => {
      if (res?.status === 200) {
        userApi()
        toast.success('Profile updated successfully')
      }
    }).catch(err => {
      toast.error('Something went wrong')
      console.log(err)
    })
    setShowloginButton(false)
  }

  const logoutdirect = () => {
    setLogoutDialog(false)
    fetchlogout(getData, '')
  }

  // File Upload Logic
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      handleUpload(acceptedFiles[0])
    }
  })

  const handleUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('profile', file)
      formData.append('_id', getData._id)
      
      if (getData.profile) {
        Object.keys(getData.profile).forEach(key => {
          if (key !== 'profileImg') formData.append(`profile[${key}]`, getData.profile[key] || '')
        })
      }
      const res = await requestApiData.updateUserProfile(formData)
      if (res?.status === 200) {
        toast.success('Profile picture updated successfully')
        setGetData(res.data)
        setFiles([])
        userApi()
        setUploadImgOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }

  const formik = useFormik({
    initialValues: {
      name: getData?.profile?.name || '',
      email: getData?.email || '',
      graduation: getData?.profile?.graduation || '',
      profileSlug: getData?.profile?.profileSlug || '',
      major: getData?.profile?.major || '',
      minor: getData?.profile?.minor || '',
      university: getData?.profile?.university || '',
      location: getData?.profile?.location || '',
      interests: getData?.profile?.interests || '',
      expLevel: getData?.profile?.expLevel || '',
      linkedin: getData?.profile?.linkedin || '',
      twitter: getData?.profile?.twitter || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true)
      const payload = {
        _id: getData._id,
        profile: {
          name: values?.name,
          graduation: values?.graduation,
          profileSlug: values?.profileSlug,
          major: values?.major,
          minor: values?.minor,
          university: values?.university,
          location: values?.location,
          interests: values?.interests,
          expLevel: values?.expLevel,
          linkedin: values?.linkedin,
          twitter: values?.twitter,
          google: getData?.profile?.google,
          wallet: walletAddress !== '' ? walletAddress : getData?.profile?.wallet
        }
      }
      try {
        const res = await requestApiData.updateUserProfile(payload)
        if (res?.status === 200) toast.success('Profile updated successfully')
      } catch (err) {
        toast.error('Failed to update profile')
      } finally {
        setLoading(false)
      }
    }
  })

  if (!getData) return null

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
      <Card elevation={0} sx={{ border: '1px solid rgba(47, 43, 61, 0.12)', borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D' }}>Student Profile</Typography>}
          subheader={<Typography variant='body2' color='text.secondary'>Manage your personal information and preferences</Typography>}
        />
        <Divider sx={{ mb: 4 }} />
        
        <CardContent>
          <Box component='form' onSubmit={formik.handleSubmit}>
            
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, gap: 3 }}>
              <Box onClick={() => setUploadImgOpen(true)} sx={{ cursor: 'pointer', position: 'relative' }}>
                <Avatar
                  src={files.length > 0 ? URL.createObjectURL(files[0]) : (getData?.profile?.profileImg ? getData.profile.profileImg + '?' + new Date().getTime() : '')}
                  sx={{ width: 120, height: 120, border: '4px solid #F4F5FA' }}
                />
                <Box sx={{
                  position: 'absolute', bottom: 0, right: 0, 
                  backgroundColor: '#7d9b17', color: 'white', 
                  borderRadius: '50%', p: 1, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  <FaPlus size={14} />
                </Box>
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 600, color: '#2F2B3D' }}>Profile Picture</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>JPG or PNG. Max size 5MB.</Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Full Name' name='name' value={formik.values.name} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Email' name='email' value={formik.values.email} disabled />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='University / School' name='university' value={formik.values.university} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Graduation Year' name='graduation' value={formik.values.graduation} onChange={formik.handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Profile Slug' name='profileSlug' value={formik.values.profileSlug} onChange={formik.handleChange} 
                  helperText={`Profile Link: https://collegedao.io/person/${formik.values.profileSlug}`} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Major' name='major' value={formik.values.major} onChange={formik.handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Minor' name='minor' value={formik.values.minor} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Location' name='location' value={formik.values.location} onChange={formik.handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Primary Interest</InputLabel>
                  <Select name='interests' value={formik.values.interests} onChange={formik.handleChange} label='Primary Interest'>
                    {allCategory.map((cat, idx) => (
                      <MenuItem key={idx} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Experience Level' name='expLevel' value={formik.values.expLevel} onChange={formik.handleChange} />
              </Grid>

              {/* Socials */}
              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Social Links</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='LinkedIn URL' name='linkedin' value={formik.values.linkedin} onChange={formik.handleChange} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><FaLinkedin color="#0077B5" /></InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Twitter / X Handle' name='twitter' value={formik.values.twitter} onChange={formik.handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FaTwitter color="#1DA1F2" /></InputAdornment> }} />
              </Grid>



              {/* Submit Button */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button variant='contained' color='primary' type='submit' size='large' disabled={loading} sx={{ px: 5, fontWeight: 700 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadImgOpen} onClose={() => setUploadImgOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Profile Picture</DialogTitle>
        <DialogContent>
          <Box {...getRootProps()} sx={{ border: '2px dashed #7d9b17', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', mt: 1 }}>
            <input {...getInputProps()} />
            <RiUpload2Fill size={40} color="#7d9b17" />
            <Typography sx={{ mt: 2, fontWeight: 600 }}>Click or drag file to this area to upload</Typography>
            <Typography variant="body2" color="text.secondary">Support for a single image upload (Max 5MB)</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadImgOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StudentProfileForm
