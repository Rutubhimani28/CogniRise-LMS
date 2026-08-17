import { Fragment, useState, useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'
import { Box, FormControl, Grid, MenuItem, Select, Typography, Button } from '@mui/material'
import { FaPlus } from 'react-icons/fa'
import { Row, Col, Form, Input, Label } from 'reactstrap'
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import Modal from '@mui/material/Modal'
import { useDropzone } from 'react-dropzone'
import { RiUpload2Fill } from 'react-icons/ri'

const style = {
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
  const [selectedFile, setSelectedFile] = useState(null)

  const [uploadImg, setUploadImg] = useState(false)
  const handleUploadImgOpen = () => setUploadImg(true)
  const handleUploadImgClose = () => setUploadImg(false)

  useEffect(() => {
    requestApiData
      .getCategories()
      .then(res => {
        setAllCategory(res.data)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  const userApi = () => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData.getUserById(createdBy.id).then(res => {
      if (res?.status === 200) {
        setGetData(res.data)
      }
    })
  }

  useEffect(() => {
    userApi()
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      setSelectedFile(acceptedFiles[0])
    }
  })

  const img = files.map(file => (
    <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} width='100px' height='100px' />
  ))

  const uploadFile = async file => {
    try {
      setUploadImg(false)

      const formData = new FormData()
      formData.append('profile', file)
      formData.append('_id', getData._id)

      if (getData.profile) {
        Object.keys(getData.profile).forEach(key => {
          if (key !== 'profileImg') {
            formData.append(`profile[${key}]`, getData.profile[key])
          }
        })
      }

      const res = await requestApiData.updateUserProfile(formData)

      if (res?.status === 200) {
        toast.success('Profile picture updated successfully')
        setGetData(res.data)
        setFiles([])
        userApi()
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }

  const formik = useFormik({
    initialValues: {
      email: getData?.email ? getData.email : '',
      name: getData?.profile?.name ? getData.profile.name : '',
      companySlug: getData?.profile?.companySlug ? getData.profile.companySlug : '',
      employeeSize: getData?.profile?.employeeSize ? getData.profile.employeeSize : '',
      industryVerticale: getData?.profile?.industryVerticale ? getData.profile.industryVerticale : '',
      companyType: getData?.profile?.companyType ? getData.profile.companyType : '',
      foundingDate: getData?.profile?.foundingDate ? getData.profile.foundingDate : '',
      description: getData?.profile?.description ? getData.profile.description : '',
      twitter: getData?.profile?.twitter ? getData.profile.twitter : '',
      linkedin: getData?.profile?.linkedin ? getData.profile.twitter : '',
      website: getData?.profile?.website ? getData.profile.twitter : ''
    },
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        _id: getData._id,
        email: getData.email,
        profile: {
          name: values?.name,
          companySlug: values?.companySlug,
          profileImg: getData?.profile?.profileImg,
          employeeSize: values?.employeeSize,
          industryVerticale: values?.industryVerticale,
          companyType: values?.companyType,
          foundingDate: values?.foundingDate,
          description: values?.description,
          twitter: values?.twitter,
          linkedin: values?.linkedin,
          website: values?.website
        }
      }

      requestApiData
        .updateUserProfile(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('User update successfuly')
          }
        })
        .catch(err => {
          toast.error('Somthing went wrong')
          console.log(err)
        })
    }
  })

  const renderProfileImage = () => {
    if (files.length > 0) {
      return (
        <img
          key={files[0].name}
          className='rounded-circle'
          src={URL.createObjectURL(files[0])}
          alt='Profile Image'
          style={{
            height: 'clamp(100px, 20vw, 148px)',
            width: 'clamp(100px, 20vw, 148px)',
            objectFit: 'cover'
          }}
        />
      )
    } else if (getData?.profile?.profileImg) {
      return (
        <img
          key={getData.profile.profileImg}
          className='rounded-circle'
          src={getData.profile.profileImg + '?' + new Date().getTime()}
          alt='Profile Image'
          style={{
            height: 'clamp(100px, 20vw, 148px)',
            width: 'clamp(100px, 20vw, 148px)',
            objectFit: 'cover'
          }}
        />
      )
    } else {
      return (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          style={{
            height: 'clamp(100px, 20vw, 148px)',
            width: 'clamp(100px, 20vw, 148px)'
          }}
        >
          <FaPlus className='add-buttone' />
          <span className='add-font text-black'>upload photo</span>
        </Box>
      )
    }
  }

  useEffect(() => {
    if (getData?.profile?.profileImg) {
      userApi()
    }
  }, [getData?.profile?.profileImg])

  return (
    <Fragment>
      <Row>
        <Col xs={12} className='enterpriser-form'>
          <Box>
            <Form className='mt-4 pt-50' onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box display='flex' py={{ xs: '10px', md: '20px' }} justifyContent='center' alignItems='center'>
                    <Label className='position-relative custom-file-upload'>
                      <Box
                        className='position-absolute top-50 start-50 translate-middle'
                        onClick={() => handleUploadImgOpen()}
                      >
                        {renderProfileImage()}
                      </Box>
                    </Label>
                  </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Company Name</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='name'
                        className='profile-input-box w-100'
                        type='text'
                        value={formik?.values?.name}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Company Email</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='email'
                        className='profile-input-box w-100'
                        type='text'
                        value={formik?.values?.email}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Company Slug</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='companySlug'
                        value={formik?.values?.companySlug}
                        onChange={formik.handleChange}
                        className='profile-input-box w-100'
                      />
                      <Typography className='mb-2 text-black mt-1'>
                        Profile Link: https://collegedao.io/company/{formik.values.companySlug}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Employee Size</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <FormControl
                        className='search-text w-100 border border-dark rounded'
                        sx={{
                          '& svg': {
                            color: 'black'
                          }
                        }}
                      >
                        <Select
                          value={formik.values.employeeSize}
                          onChange={formik.handleChange}
                          name='employeeSize'
                          defaultValue={formik.values.employeeSize}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          sx={{ color: 'black' }}
                        >
                          <MenuItem value='1-10'>1-10</MenuItem>
                          <MenuItem value='11-50'>11-50</MenuItem>
                          <MenuItem value='51-1000'>51-1000</MenuItem>
                          <MenuItem value='1000+'>1000+</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Industry Vertical</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <FormControl
                        className='search-text w-100 border border-dark rounded'
                        sx={{
                          '& svg': {
                            color: 'black'
                          }
                        }}
                      >
                        <Select
                          name='industryVerticale'
                          value={formik.values.industryVerticale}
                          onChange={formik.handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          sx={{ color: 'black' }}
                        >
                          {allCategory &&
                            allCategory.map((item, index) => (
                              <MenuItem key={index} value={item.name}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Company Type</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <FormControl
                        className='search-text w-100 border border-dark'
                        sx={{
                          borderRadius: '5px',
                          '& svg': {
                            color: 'black'
                          }
                        }}
                      >
                        <Select
                          name='companyType'
                          value={formik.values.companyType}
                          onChange={formik.handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          sx={{ color: 'black' }}
                        >
                          <MenuItem value='Profit'>Profit</MenuItem>
                          <MenuItem value='Non-Profit'>Non-Profit</MenuItem>
                          <MenuItem value='Blockchain Ecosystem'>Blockchain Ecosystem</MenuItem>
                          <MenuItem value='DAO'>DAO</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Founding Date</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        type='date'
                        name='foundingDate'
                        className='profile-input-box w-100'
                        value={formik.values.foundingDate}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black company-description-left'>Company Description</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='description'
                        type='textarea'
                        rows='3'
                        cols='8'
                        value={formik?.values?.description}
                        onChange={formik.handleChange}
                        className='profile-input-box w-100'
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Twitter</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        value={formik.values.twitter}
                        onChange={formik.handleChange}
                        name='twitter'
                        className='profile-input-box w-100'
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Linkedin</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='linkedin'
                        value={formik.values.linkedin}
                        onChange={formik.handleChange}
                        className='profile-input-box w-100'
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Label className='text-black'>Website</Label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                      <Input
                        name='website'
                        className='profile-input-box w-100'
                        value={formik.values.website}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={2}></Grid>
                      <Grid item xs={12} md={10}>
                        <Button type='submit' className='w-100 ms-1 beforeLoginbtn'>
                          save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </Box>
        </Col>
      </Row>

      <Modal
        open={uploadImg}
        onClose={handleUploadImgClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            className='fs-3 pb-3 addHeadingColor'
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, textAlign: 'center' }}
          >
            Upload Image
          </Typography>

          <Box
            {...getRootProps({ className: 'dropzone' })}
            sx={{
              border: '1px solid #414141',
              borderRadius: '5px',
              padding: { xs: 2, sm: 4 },
              minHeight: files.length ? { xs: 250, sm: 450 } : 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              mt: 2
            }}
          >
            <input {...getInputProps()} />
            {files.length ? (
              img
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%'
                }}
              >
                <RiUpload2Fill size={40} />
                <Typography
                  variant='body'
                  sx={{
                    mb: 2.5,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    wordBreak: 'break-word',
                    maxWidth: '100%'
                  }}
                  className='text-black'
                >
                  Choose a file or drag and drop it here
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant='body2'
            sx={{
              mb: 2.5,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              textAlign: 'center',
              mt: 2,
              wordBreak: 'break-word'
            }}
            className='text-black py-2'
          >
            File types supported: JPG, PNG. Max Size: 5 MB
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4 }}>
            <Button
              type='button'
              className='me-2 px-4 d-lg-flex d-sm-block  align-items-center beforeLoginbtn'
              onClick={handleUploadImgClose}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='me-2 px-4 d-lg-flex d-sm-block align-items-center beforeLoginbtn'
              onClick={() => uploadFile(selectedFile)}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  )
}
