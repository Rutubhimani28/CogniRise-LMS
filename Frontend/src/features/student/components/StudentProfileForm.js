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
  CircularProgress,
  Tooltip
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
import { useAuth } from 'src/hooks/useAuth'

export const StudentProfileForm = () => {
  const { user, setUser } = useAuth()
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
  const [deleteImg, setDeleteImg] = useState(false)

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
    }).catch(err => {
      console.error('Failed to fetch user data:', err)
      if (err.response?.status === 404) {
        // Handle user not found (e.g., clear localStorage and redirect to login)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
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
        }).catch(err => console.error(err))
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
    }
  })

  const handleUpload = async (file) => {
    // This function is no longer used directly from the modal.
    // The upload logic has been moved to the form's onSubmit handler.
  }

  const handleDeleteProfileImg = async () => {
    setDeleteImg(true)
    setFiles([])
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

      try {
        let res;
        if (files.length > 0) {
          const formData = new FormData()
          formData.append('profile', files[0])
          formData.append('_id', getData._id)

          const profileData = {
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

          Object.keys(profileData).forEach(key => {
            formData.append(`profile[${key}]`, profileData[key] || '')
          })

          res = await requestApiData.updateUserProfile(formData)
        } else {
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
          if (deleteImg) {
            payload.profile.profileImg = ''
          }
          res = await requestApiData.updateUserProfile(payload)
        }

        if (res?.status === 200) {
          toast.success('Profile updated successfully')
          setGetData(res.data)
          if (files.length > 0 || deleteImg) {
            const updatedUser = { ...user, profileImg: res.data.profile?.profileImg || '' }
            if (updatedUser.profile) updatedUser.profile.profileImg = res.data.profile?.profileImg || ''
            setUser(updatedUser)
            window.localStorage.setItem('userData', JSON.stringify(updatedUser))
            setFiles([])
            setDeleteImg(false)
          }
        }
      } catch (err) {
        toast.error('Failed to update profile')
      } finally {
        setLoading(false)
      }
    }
  })

  if (!getData) {
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
                  <Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D' }}>Student Profile</Typography>
                  <Typography variant='body2' color='text.secondary'>Manage your personal information and preferences</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box onClick={() => setUploadImgOpen(true)} sx={{ cursor: 'pointer', position: 'relative', mb: 2 }}>
                    <Avatar
                      src={files.length > 0 ? URL.createObjectURL(files[0]) : (deleteImg ? '' : (getData?.profile?.profileImg ? getData.profile.profileImg + '?' + new Date().getTime() : ''))}
                      sx={{ width: 140, height: 140, border: '4px solid #F4F5FA' }}
                    />
                    <Box sx={{
                      position: 'absolute', bottom: 5, right: 5,
                      backgroundColor: '#7d9b17', color: 'white',
                      borderRadius: '50%', p: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <FaPlus size={16} />
                    </Box>
                  </Box>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600, color: '#2F2B3D' }}>Profile Picture</Typography>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>JPG or PNG. Max size 5MB.</Typography>
                  {getData?.profile?.profileImg && !deleteImg && (
                    <Button
                      variant='contained'
                      size='small'
                      onClick={handleDeleteProfileImg}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 0.5,
                        px: 2,
                        backgroundColor: '#ef4444 !important',
                        color: 'white !important',
                        '&:hover': {
                          backgroundColor: '#dc2626 !important'
                        }
                      }}
                    >
                      Delete Picture
                    </Button>
                  )}
                </Box>

                <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1.5, color: '#2F2B3D' }}>Social Links</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField fullWidth label='LinkedIn URL' name='linkedin' value={formik.values.linkedin} onChange={formik.handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FaLinkedin color="#0077B5" /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Twitter / X Handle' name='twitter' value={formik.values.twitter} onChange={formik.handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FaTwitter color="#1DA1F2" /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                </Box>
              </Grid>

              {/* Column 2: Personal Info */}
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1.5, color: '#2F2B3D' }}>Personal Information</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField fullWidth label='Full Name' name='name' value={formik.values.name} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Email' name='email' value={formik.values.email} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Location' name='location' value={formik.values.location} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <FormControl fullWidth>
                    <InputLabel>Primary Interest</InputLabel>
                    <Select name='interests' value={formik.values.interests} onChange={formik.handleChange} label='Primary Interest' sx={{ borderRadius: '8px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17', borderWidth: '2px' } }}>
                      {allCategory.map((cat, idx) => (
                        <MenuItem key={idx} value={cat.name}>{cat.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField fullWidth label='Experience Level' name='expLevel' value={formik.values.expLevel} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                </Box>
              </Grid>

              {/* Column 3: Education */}
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1.5, color: '#2F2B3D' }}>Education & Profile</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField fullWidth label='University / School' name='university' value={formik.values.university} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Graduation Year' name='graduation' value={formik.values.graduation} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Major' name='major' value={formik.values.major} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Minor' name='minor' value={formik.values.minor} onChange={formik.handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }} />
                  <TextField fullWidth label='Profile Slug' name='profileSlug' value={formik.values.profileSlug} onChange={formik.handleChange}
                    helperText={`Profile Link: https://collegedao.io/person/${formik.values.profileSlug}`} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } }, '& .MuiFormHelperText-root': { margin: '3px 0 0 0', fontSize: '0.75rem' } }} />
                </Box>
              </Grid>

            </Grid>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Tooltip title={(!formik.dirty && files.length === 0 && !deleteImg) ? "Make changes to enable saving" : ""} placement="top" arrow>
                <span>
                  <Button variant='contained' color='primary' type='submit' size='large' disabled={loading || (!formik.dirty && files.length === 0 && !deleteImg)} sx={{ px: 6, py: 1.5, fontWeight: 700, minWidth: '180px', position: 'relative', borderRadius: '8px', fontSize: '1rem' }}>
                    {loading && <CircularProgress size={24} color="inherit" sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
                    <span style={{ opacity: loading ? 0 : 1 }}>Save Profile</span>
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadImgOpen} onClose={() => { setUploadImgOpen(false); setFiles([]); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, color: '#7d9b17' }}>Upload Profile Photo</DialogTitle>
        <DialogContent>
          <Box {...getRootProps()} sx={{ border: '2px dashed #7d9b17', borderRadius: 4, p: 4, textAlign: 'center', cursor: 'pointer', mt: 1, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <img src={URL.createObjectURL(files[0])} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
              <>
                <RiUpload2Fill size={50} color="#7d9b17" />
                <Typography sx={{ mt: 2, fontWeight: 600, color: '#333' }}>Click or drag file to this area to upload</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Supported: JPG, PNG • Max: 5 MB</Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => { setUploadImgOpen(false); setFiles([]); }}
            sx={{ borderColor: '#7d9b17', color: '#7d9b17', borderRadius: '8px', px: 4, fontWeight: 600, '&:hover': { borderColor: '#4338ca', backgroundColor: 'rgba(79, 70, 229, 0.08)' } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setUploadImgOpen(false)}
            disabled={files.length === 0}
            sx={{ backgroundColor: '#7d9b17', color: 'white', borderRadius: '8px', px: 4, fontWeight: 600, '&:hover': { backgroundColor: '#4338ca' } }}
          >
            Save Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StudentProfileForm

