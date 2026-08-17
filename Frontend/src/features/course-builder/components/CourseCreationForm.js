import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Card, Label, Input } from 'reactstrap'
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Autocomplete
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
            setTags(res?.data?.tags)
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
      <img
        key={file.name}
        alt={file.name}
        className='single-file-image'
        src={URL.createObjectURL(file)}
        width='100px'
        height='100px'
      />
    ))
  } else if (courseData?.banner) {
    img = (
      <img
        className='single-file-image'
        src={courseData.banner[0]}
        width='100px'
        height='100px'
        alt='Course Banner'
      />
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
              <Card className='border-0 p-4 profile-wrap mt-4 text-start'>
                <Label className='form-label fs-5 text-black' for='title'>
                  Course Banner
                </Label>
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

                <Label className='form-label fs-5 text-black' for='title'>
                  Title
                </Label>
                <Input
                  className='profile-input-box'
                  name='title'
                  type='text'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />

                <Label className='form-label fs-5 text-black' for='title'>
                  Course Slug
                </Label>
                <Input
                  className='profile-input-box'
                  name='slug'
                  type='text'
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                />
                <span className='text-black pb-4'>Course Link: https://collegedao.io/courses/{formik.values.slug}</span>

                <Label className='form-label fs-5 text-black' for='title'>
                  Description
                </Label>
                <Input
                  className='profile-input-box'
                  name='description'
                  type='textarea'
                  rows='6'
                  col='6'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <Label className='form-label fs-5 text-black' for='firstName'>
                  Category
                </Label>
                <FormControl
                  sx={{
                    m: 1,
                    borderRadius: 1,
                    border: '1px solid black',
                    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                    '& .MuiSelect-icon': {
                      color: 'black'
                    }
                  }}
                >
                  <Select
                    name='category'
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {allCategory &&
                      allCategory.map((item, index) => (
                        <MenuItem key={index} value={item.name} className='text-black'>
                          <span className='text-black'>{item.name}</span>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Label className='form-label pt-3 pe-4 fs-5 text-black' for='firstName'>
                  Tags
                </Label>

                <div className='tags-input text-white'>
                  <ul id='tags' className='d-flex p-0 text-white'>
                    {tags.map((tag, index) => (
                      <li key={index} className='tag me-2 list-unstyled'>
                        <span
                          className='tag-title text-black bg-white'
                          style={{
                            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
                          }}
                        >
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <FormControl variant='standard' sx={{ width: '100%' }}>
                    <div className='d-flex'>
                      <TextField
                        className='custom-input profile-input-box position-relative'
                        name='tag'
                        type='text'
                        sx={{
                          border: '1px solid black',
                          '& .MuiInputBase-input': {
                            color: 'black'
                          },
                          '& input:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 100px white inset !important',
                            WebkitTextFillColor: 'black !important',
                            caretColor: 'black'
                          },
                          '& input:-webkit-autofill:focus': {
                            WebkitBoxShadow: '0 0 0 100px white inset !important',
                            WebkitTextFillColor: 'black !important',
                            caretColor: 'black'
                          },
                          '& input::placeholder': {
                            color: 'grey',
                            opacity: 1
                          }
                        }}
                        value={tagsInput}
                        placeholder='Add tag'
                        onChange={handleInputChange}
                      />
                      <Button
                        type='button'
                        className='p-0 bg-transparent position-absolute border-0 tag-btn'
                        style={{ right: '10px', top: '20px', color: 'black' }}
                        onClick={event => addTagsButton(event)}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </FormControl>
                </div>
                <Label className='form-label pt-3 pe-4 fs-5 text-black' for='firstName'>
                  Prerequisites
                </Label>
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
                      placeholder='Course'
                      sx={{
                        border: '1px solid black',
                        borderRadius: 1,
                        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                        '& .MuiInputBase-input': {
                          color: 'black'
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: '100%',
                    '& .MuiChip-label': {
                      color: 'black'
                    },
                    '& .MuiAutocomplete-tag': {
                      backgroundColor: '#f0f0f0',
                      '& .MuiChip-deleteIcon': {
                        color: 'black'
                      },
                      '& .MuiChip-deleteIcon:hover': {
                        color: 'black'
                      }
                    },
                    '& .MuiAutocomplete-endAdornment svg': {
                      color: 'black'
                    }
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        color: 'black',
                        '& .MuiAutocomplete-option': {
                          color: 'black'
                        },
                        '& .MuiAutocomplete-noOptions': {
                          color: 'grey'
                        }
                      }
                    },
                    popper: {
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 4]
                          }
                        }
                      ]
                    }
                  }}
                />
                <Label className='form-label pt-3 fs-5 text-black' for='title'>
                  Course length
                </Label>
                <Input
                  className='profile-input-box'
                  name='courseLength'
                  type='text'
                  value={formik.values.courseLength}
                  onChange={formik.handleChange}
                />

                <Label className='form-label fs-5 text-black' for='firstName'>
                  Course Level
                </Label>
                <FormControl sx={{ m: 1 }}>
                  <Select
                    name='level'
                    value={formik.values.level}
                    sx={{
                      border: '1px solid black',
                      boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                      '& .MuiSelect-icon': {
                        color: 'black'
                      },
                      color: 'black'
                    }}
                    onChange={formik.handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value='beginner' className='text-black'>
                      Beginner
                    </MenuItem>
                    <MenuItem value='intermediate' className='text-black'>
                      Intermediate
                    </MenuItem>
                    <MenuItem value='advanced' className='text-black'>
                      Advanced
                    </MenuItem>
                  </Select>
                </FormControl>

                <div className='d-flex justify-content-end pt-4'>
                  <Button
                    type='button'
                    className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
                    onClick={() => nextTab()}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </TabPanel>

            <TabPanel value='2'>
              <div className='border-0 p-4 profile-wrap mt-4 '>
                <CourseBuilder setData={handleModuleData} getData={moduleData} />

                <div className='d-flex justify-content-between pt-5'>
                  <Button
                    type='button'
                    className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
                    onClick={() => backTab()}
                  >
                    Back
                  </Button>

                  <div className='d-md-flex'>
                    <Button
                      onClick={() => {
                        formik.handleSubmit(), setUserStatus({ status: 'draft' })
                      }}
                      className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
                    >
                      Draft
                    </Button>
                    <Button
                      onClick={() => {
                        formik.handleSubmit(), setUserStatus({ status: 'pending' })
                      }}
                      className='me-2 px-4 mt-md-2 d-flex align-items-center beforeLoginbtn'
                    >
                      publish
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </form>
    </div>
  )
}
