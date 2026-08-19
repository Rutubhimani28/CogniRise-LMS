import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Label, Input } from 'reactstrap'
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Autocomplete,
  CircularProgress,
  Card
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import CourseBuilder from './CourseBuilder'
import AddIcon from '@mui/icons-material/Add'
import * as yup from 'yup'
import { useFormik } from 'formik'

import { useRouter } from 'next/router'
import Requests from 'src/configs/axiosRequest'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa'

export const CourseCreationForm = () => {
  const router = useRouter()
  const requestApiData = new Requests()
  const [tabValue, setTabValue] = useState('1')
  const [courseBanner, setCourseBanner] = useState([])
  const [tags, setTags] = useState([])
  const [tagsInput, setTagsInput] = useState('')
  const [preRequisitesValue, setPreRequisitesValue] = useState([])
  const [moduleData, setModuleData] = useState([])
  const [allCategory, setAllCategory] = useState([])
  const [allCourse, setAllCourse] = useState([])
  const [courseData, setCourseData] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [userStatus, setUserStatus] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const url_str = window.location.href
    let url = new URL(url_str)
    let search_params = url.searchParams
    const updateId = search_params.get('id')

    if (updateId) {
      setCourseId(updateId)

      requestApiData
        .oneCourseRequest(updateId)
        .then(res => {
          if (res?.status === 200) {
            setCourseData(res?.data)
            setModuleData(res?.data?.modules)
            setTags(res?.data?.tags ? res.data.tags.filter(tag => tag && tag.trim() !== '' && tag.trim() !== '[]' && tag.trim() !== '[""]') : [])
            setPreRequisitesValue(res?.data?.preRequisites)
          }
        })
        .catch(err => {
          console.log('oneCourseRequest in upload course', err)
        })
    }
  }, [])

  useEffect(() => {
    requestApiData
      .getCategories()
      .then(res => {
        setAllCategory(res.data)
      })
      .catch(err => {
        console.log('Get all categories on add course page', err)
      })
    requestApiData
      .courseRequest()
      .then(res => {
        setAllCourse(res.data)
      })
      .catch(err => {
        console.log('Get all courses on add course page', err)
      })
  }, [])

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const backTab = () => setTabValue('1')
  const nextTab = () => setTabValue('2')

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: acceptedFiles => {
      setCourseBanner(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  let img = null
  if (courseBanner.length > 0) {
    img = courseBanner.map(file => (
      <Box display='flex' justifyContent='center' alignItems='center' width='100%' height='100%' key={file.name}>
        <img
          alt={file.name}
          className='single-file-image'
          src={URL.createObjectURL(file)}
          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Box>
    ))
  } else if (courseData?.banner && courseData.banner.length > 0 && (typeof courseData.banner === 'string' ? courseData.banner : courseData.banner[0])) {
    const bannerUrl = typeof courseData.banner === 'string' ? courseData.banner : courseData.banner[0];
    img = (
      <Box display='flex' justifyContent='center' alignItems='center' width='100%' height='100%'>
        <img
          className='single-file-image'
          src={bannerUrl}
          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
          alt='Course Banner'
        />
      </Box>
    )
  }

  const handleModuleData = data => {
    setModuleData(data)
  }

  const user = JSON.parse(window.localStorage.getItem('userData'))
  const validationSchema = yup.object({})

  let numItems = 0

  const formik = useFormik({
    initialValues: {
      title: courseData?.title ? courseData.title : '',
      slug: courseData?.slug ? courseData.slug : '',
      description: courseData?.description ? courseData.description : '',
      category: courseData?.category ? courseData.category : '',
      tags: '',
      preRequisites: '',
      courseLength: courseData?.courseLength ? courseData.courseLength : '',
      level: courseData?.level ? courseData.level : ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: values => {
      setLoading(true)
      {
        moduleData &&
          moduleData.map(
            (module, mindex) =>
              module?.items && module.items.map((item, index) => (item.navNo = `item_${++numItems}`))
          )
      }
      if (courseId) {
        const formData = new FormData()
        formData.append('_id', courseId)
        formData.append('title', values.title)
        formData.append('slug', values.slug)
        formData.append('description', values.description)
        formData.append('category', values.category)
        formData.append('courseLength', values.courseLength)
        formData.append('level', values.level)
        formData.append('createdBy', user?.id)
        formData.append('createdName', user?.name)
        formData.append('totalItems', numItems)
        formData.append('status', userStatus?.status)
        formData.append('approvals', 'course_update')

        formData.append('tags', JSON.stringify(tags))
        formData.append('preRequisites', JSON.stringify(preRequisitesValue))
        formData.append('modules', JSON.stringify(moduleData))

        if (courseBanner.length > 0) {
          formData.append('banner', courseBanner[0])
        }

        requestApiData
          .updateCourseRequest(formData)
          .then(res => {
            toast.success('You are Successfully update course')
            setUserStatus({})
            router.push('/enterprise-courses')
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
          .finally(() => setLoading(false))
      } else {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('slug', values.slug)
        formData.append('description', values.description)
        formData.append('category', values.category)
        formData.append('courseLength', values.courseLength)
        formData.append('level', values.level)
        formData.append('createdBy', user?.id)
        formData.append('createdName', user?.name)
        formData.append('totalItems', numItems)
        formData.append('status', userStatus?.status)

        formData.append('tags', JSON.stringify(tags))
        formData.append('preRequisites', JSON.stringify(preRequisitesValue))
        formData.append('modules', JSON.stringify(moduleData))

        if (courseBanner.length > 0) {
          formData.append('banner', courseBanner[0])
        }

        requestApiData
          .createCourseRequest(formData)
          .then(res => {
            toast.success('You are Successfully add course')
            router.push('/enterprise-courses')
            setUserStatus({})
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
          .finally(() => setLoading(false))
      }
    }
  })

  const handleInputChange = e => {
    setTagsInput(e.target.value)
  }

  const addTagsButton = e => {
    e.preventDefault()
    if (tagsInput !== '') {
      setTags([...tags, tagsInput])
      setTagsInput('')
    }
  }

  const handlePreRequisites = (e, value) => {
    if (value.length > 0 && preRequisitesValue.indexOf(value[0]._id) === -1) {
      setPreRequisitesValue([...preRequisitesValue, value[0]._id])
    }
  }

  return (
    <div className='course-creation'>
      <form>
        <Box className='text-center '>
          <TabContext value={tabValue}>
            <Box className='container-fluid px-2'>
              <div className='row'>
                <div className='col-12'>
                  <Box className='overflow-auto'>
                    <TabList
                      onChange={handleChange}
                      aria-label='responsive tabs'
                      variant='scrollable'
                      scrollButtons='auto'
                      allowScrollButtonsMobile
                      className='d-flex justify-content-center flex-nowrap course-tab-list custom-tab-container'
                    >
                      <Tab
                        className={`custom-tab-button ${tabValue === '1' ? 'active-tab' : ''}`}
                        label={<span className='tab-label fw-semibold text-black'>Course Details</span>}
                        value='1'
                      />
                      <Tab
                        className={`custom-tab-button ${tabValue === '2' ? 'active-tab' : ''}`}
                        label={<span className='tab-label fw-semibold text-black'>Course Builder</span>}
                        value='2'
                      />
                    </TabList>
                  </Box>
                </div>
              </div>
            </Box>

            <TabPanel value='1'>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8e8e8', p: { xs: 3, md: 4 }, mt: 4, textAlign: 'left' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1, color: '#2F2B3D' }}>
                  Course Banner
                </Typography>
                <Box
                  {...getRootProps({ className: 'dropzone' })}
                  sx={courseBanner.length ? { height: 150 } : {}}
                  style={{ border: '2px dashed black', borderRadius: '5px', padding: '20px' }}
                >
                  <input {...getInputProps()} />
                  {img ? (
                    img
                  ) : (
                    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' py='80px'>
                      <FaPlus className='add-buttone text-white' fontSize={30} />
                      <span className='text-black'>Choose a file or drag and drop it here</span>
                    </Box>
                  )}
                </Box>
                <Typography variant='body2' sx={{ mb: 2.5 }} className='text-black py-2'>
                  File types supported: JPG, PNG. Max Size: 5 MB
                </Typography>

                <TextField
                  fullWidth
                  label='Title'
                  name='title'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder='Enter Title'
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label='Course Slug'
                  name='slug'
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder='Enter Course Slug'
                  sx={{ mb: 1 }}
                />
                <span className='text-black pb-4 d-block'>Course Link: https://collegedao.io/courses/{formik.values.slug}</span>

                <TextField
                  fullWidth
                  label='Description'
                  name='description'
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder='Enter Description'
                  sx={{ mb: 3 }}
                />
                <TextField
                  select
                  fullWidth
                  label='Category'
                  name='category'
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  sx={{ mb: 3 }}
                >
                  {allCategory &&
                    allCategory.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>

                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={tags}
                  onChange={(event, newValue) => {
                    setTags(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tag and press Enter"
                      sx={{ mb: 3 }}
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  name='preRequisites'
                  noOptionsText={'Not added any course'}
                  options={allCourse || []}
                  getOptionLabel={option => option.title}
                  onChange={handlePreRequisites}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Prerequisites'
                      placeholder='Select Course'
                      sx={{ mb: 3 }}
                    />
                  )}
                  sx={{ width: '100%' }}
                />
                <TextField
                  fullWidth
                  label='Course Length'
                  name='courseLength'
                  value={formik.values.courseLength}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder='Enter Course Length'
                  sx={{ mb: 3 }}
                />

                <TextField
                  select
                  fullWidth
                  label='Course Level'
                  name='level'
                  value={formik.values.level}
                  onChange={formik.handleChange}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value='beginner'>Beginner</MenuItem>
                  <MenuItem value='intermediate'>Intermediate</MenuItem>
                  <MenuItem value='advanced'>Advanced</MenuItem>
                </TextField>

                <div className='d-flex justify-content-end pt-4'>
                  <Button
                    type='button'
                    variant='contained'
                    onClick={() => nextTab()}
                    sx={{
                      bgcolor: '#7d9b17',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { bgcolor: '#4338ca' }
                    }}
                  >
                    Next Step
                  </Button>
                </div>
              </Card>
            </TabPanel>

            <TabPanel value='2'>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8e8e8', p: { xs: 3, md: 4 }, mt: 4 }}>
                <CourseBuilder setData={handleModuleData} getData={moduleData} />

                <div className='d-flex justify-content-between pt-5 mt-4 border-top'>
                  <Button
                    type='button'
                    variant='outlined'
                    onClick={() => backTab()}
                    sx={{
                      borderColor: '#7d9b17',
                      color: '#7d9b17',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { borderColor: '#4338ca', bgcolor: 'rgba(79, 70, 229,0.04)' }
                    }}
                  >
                    Back
                  </Button>

                  <div className='d-md-flex gap-3'>
                    <Button
                      disabled={loading}
                      variant='outlined'
                      onClick={() => {
                        formik.handleSubmit(), setUserStatus({ status: 'draft' })
                      }}
                      sx={{
                        borderColor: '#7d9b17',
                        color: '#7d9b17',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { borderColor: '#4338ca', bgcolor: 'rgba(79, 70, 229,0.04)' }
                      }}
                    >
                      {loading && userStatus?.status === 'draft' ? <CircularProgress size={24} color="inherit" /> : 'Save as Draft'}
                    </Button>
                    <Button
                      disabled={loading}
                      variant='contained'
                      onClick={() => {
                        formik.handleSubmit(), setUserStatus({ status: 'pending' })
                      }}
                      sx={{
                        bgcolor: '#7d9b17',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { bgcolor: '#4338ca' }
                      }}
                    >
                      {loading && userStatus?.status === 'pending' ? <CircularProgress size={24} color="inherit" /> : 'Publish Course'}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabContext>
        </Box>
      </form>
    </div>
  )
}

