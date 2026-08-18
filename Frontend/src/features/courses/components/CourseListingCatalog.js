import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Slider,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Card,
  CardMedia,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { HiSearch, HiStar } from 'react-icons/hi'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import imgConst from 'src/configs/imgConst'
import Pagination from '@mui/material/Pagination'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import AfterLoginHeader from 'src/views/pages/components/AfterLoginHeader'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-hot-toast'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const drawerWidth = 350

const findlevel = [
  { name: 'beginner', status: false },
  { name: 'intermediate', status: false },
  { name: 'advance', status: false }
]

export const CourseListingCatalog = () => {
  const [cardDetails, SetcardDetails] = useState([])
  const [pagelimit] = useState(6)
  const [page, setpage] = useState(1)
  const totalpage = Math.ceil(cardDetails.length / pagelimit)
  const [handlEnrollModel, setHandlEnrollModel] = useState(false)
  const lastindex = page * pagelimit
  const firstindex = lastindex - pagelimit
  const AllData = cardDetails.slice(firstindex, lastindex)
  const [Totalcourse, SetTotalcourse] = useState([])
  const [enrollCourse, setEnrollCourse] = useState({})
  const [lev] = useState([])
  const student = JSON.parse(window.localStorage.getItem('userData'))
  const [findslevel, setfindslevel] = useState(findlevel)
  const [filterLevel, setFilterLevel] = useState([])
  const [slider, setslider] = useState(1)
  let objlevel = {}
  let filter = {}

  const [loading, setLoading] = useState(true)

  const handlechangepage = (e, p) => {
    setpage(p)
  }

  const requestApiData = new Requests()
  useEffect(() => {
    setLoading(true)
    requestApiData.TotalCouses().then(res => {
      SetcardDetails(res.data)
      SetTotalcourse(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  let data = findslevel
    .filter(el => el.status)
    .map(el => {
      return {
        level: el.name
      }
    })

  useEffect(() => {
    if (data.length > 0) {
      filter.$or = data
    }
  }, [data])

  const le = () => {
    requestApiData.TotalCouses().then(res => {
      SetcardDetails(res.data)
    })
  }

  for (var i = 0; i < lev.length; i++) {
    let data = lev[i].level
    if (objlevel[data] === undefined) {
      objlevel[data] = true
    }
  }

  useEffect(() => {
    le()
  }, [])

  const searchCourse = e => {
    const query = e.target.value.toLowerCase()
    if (query === '') {
      SetcardDetails(Totalcourse)
    } else {
      const filtered = Totalcourse.filter(course =>
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
      )
      SetcardDetails(filtered)
    }
    setpage(1)
  }

  const handleClickdelete = el => {
    const updatedLevels = findslevel.map(item => (item.name === el.name ? { ...item, status: false } : item))
    setfindslevel(updatedLevels)

    const selectedLevels = updatedLevels.filter(item => item.status).map(item => item.name)
    setFilterLevel(selectedLevels)

    applyFilters(selectedLevels, slider)
  }

  const handlechange = e => {
    const { value } = e.target
    const updatedLevels = findslevel.map(item => (item.name === value ? { ...item, status: true } : { ...item, status: false }))
    setfindslevel(updatedLevels)

    const selectedLevels = updatedLevels.filter(item => item.status).map(item => item.name)
    setFilterLevel(selectedLevels)

    applyFilters(selectedLevels, slider)
  }

  const applyFilters = (levels, duration) => {
    requestApiData.TotalCouses().then(res => {
      let filteredData = res.data

      if (levels.length > 0) {
        const lowerLevels = levels.map(l => l.toLowerCase())
        filteredData = filteredData.filter(item => {
          const courseLevel = item.level ? item.level.toLowerCase() : 'beginner'
          return lowerLevels.includes(courseLevel)
        })
      }
      filteredData = filteredData.filter(item => {
        const courseDuration = parseInt(item.courseLength?.split(' ')[0] || '0')
        return courseDuration <= duration
      })

      SetcardDetails(filteredData)
    })
  }

  const handleChangeSlider = e => {
    const newDuration = e.target.value
    setslider(newDuration)
    applyFilters(filterLevel, newDuration)
  }

  const enrollCourseStudent = item => {
    const payload = {
      studentID: student?.id,
      courseID: item._id,
      courseName: item.title,
      enterpriseID: item.createdBy,
      status: 'Ongoing',
      totalTask: item.totalItems
    }
    requestApiData
      .setEnrollment(payload)
      .then(res => {
        if (res.status === 200) {
          if (!res.data.message) {
            setHandlEnrollModel(false)
            toast.success(`${item.title} enroll`)
          }
        }
        if (res.data.message) {
          setHandlEnrollModel(false)
          toast.error(res.data.message)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div>
      <Grid container sx={{ padding: '0px 20px', mt: 1 }}>
        <Grid
          item
          xs={12}
          md={3}
          className='mx-2'
          sx={{
            px: { xs: 2, md: 4, sm: 4 },
            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
            py: 3,
            bgcolor: 'white',
            borderRadius: '20px',
            mb: { xs: 2, md: 0 }
          }}
        >
          {/* LEVEL */}
          <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 700, fontSize: '1.1rem', color: '#7d9b17' }}>
            Level
          </Typography>
          <FormGroup sx={{ mb: 4 }}>
            {findslevel.map((el, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={!!el.status}
                    value={el.name}
                    name={el.name}
                    onChange={handlechange}
                    icon={<RadioButtonUncheckedIcon sx={{ color: '#7d9b17' }} />}
                    checkedIcon={<RadioButtonCheckedIcon sx={{ color: '#7d9b17' }} />}
                  />
                }
                label={el.name}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: 'black',
                    fontWeight: 500
                  }
                }}
              />
            ))}
          </FormGroup>

          {/* DURATION */}
          <Typography variant='subtitle1' sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#7d9b17' }}>
            Duration
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              gap: 2,
              mt: 3,
              width: '100%'
            }}
          >
            <Box
              sx={{
                width: '100%',
                paddingLeft: { xs: '12px', sm: '32px' },
                paddingRight: { xs: '12px', sm: '32px' }
              }}
            >
              <Slider
                defaultValue={1}
                valueLabelDisplay='auto'
                onChange={handleChangeSlider}
                step={1}
                min={1}
                max={4}
                marks={[
                  { value: 1, label: '1 week' },
                  { value: 2, label: '2 weeks' },
                  { value: 3, label: '3 weeks' },
                  { value: 4, label: '4 weeks' }
                ]}
                sx={{
                  color: 'black',
                  '& .MuiSlider-markLabel': {
                    color: 'black',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' }
                  },
                  '& .MuiSlider-valueLabel': {
                    color: 'white',
                    backgroundColor: 'black',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  },
                  '& .MuiSlider-thumb': {
                    width: { xs: 16, sm: 20 },
                    height: { xs: 16, sm: 20 }
                  }
                }}
              />
            </Box>
          </Box>

          {/* ACTIVE FILTERS */}
          <Typography variant='subtitle1' sx={{ pt: 4, fontWeight: 700, fontSize: '1.1rem', color: '#7d9b17' }}>
            Active Filters
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
            {findslevel
              .filter(el => el.status)
              .map((el, i) => (
                <Chip
                  key={i}
                  className='me-2 mb-2'
                  label={el.name}
                  variant='outlined'
                  onDelete={() => handleClickdelete(el)}
                  sx={{
                    color: 'black',
                    borderColor: 'black',
                    '& .MuiChip-deleteIcon': {
                      color: 'black',
                      '&:hover': {
                        color: '#555'
                      }
                    }
                  }}
                />
              ))}
          </Box>

          {/* WEEK DISPLAY */}
          <Typography color='black' sx={{ mt: 2 }}>
            {slider} week
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md
          sx={{
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            px: { xs: 2, md: 6 },
            pt: { xs: 3, md: 0 },
            pb: 3
          }}
        >
          <Typography variant='h4' className='course-listing-heading addHeadingColor' gutterBottom>
            Explore Courses
          </Typography>

          <FormControl fullWidth sx={{ mb: 4, mt: 1 }}>
            <OutlinedInput
              placeholder='Search for courses...'
              onChange={searchCourse}
              startAdornment={
                <InputAdornment position='start'>
                  <HiSearch size={22} color='#7d9b17' />
                </InputAdornment>
              }
              sx={{
                height: 56,
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#7d9b17',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#7d9b17',
                  borderWidth: '2px',
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(125, 155, 23, 0.15)',
                }
              }}
            />
          </FormControl>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress sx={{ color: '#7d9b17' }} size={60} thickness={4} />
            </Box>
          ) : AllData?.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', textAlign: 'center' }}>
              <Typography variant='h5' sx={{ fontWeight: 700, color: '#2F2B3D', mb: 1 }}>No Courses Found</Typography>
              <Typography variant='body1' sx={{ color: '#777' }}>Try adjusting your search or filters to find what you're looking for.</Typography>
            </Box>
          ) : (
            <Grid container spacing={5}>
              {AllData?.map((item, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'white',
                      color: 'black',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component='img'
                      height='180'
                      image={imgConst[item.imageKey] || imgConst.bitcoin}
                      alt='Course image'
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                      <Typography variant='subtitle2' sx={{ color: '#7d9b17', mb: 1, fontWeight: 600 }}>
                        {item.category}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#555', mb: 2, flexGrow: 1 }}>
                        {item.description?.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>{item.rating}</Typography>
                          <HiStar color='#FFD700' size={18} />
                          <Typography variant='body2' sx={{ color: '#777' }}>({item.review} Reviews)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip label={item.level || 'Beginner'} size='small' sx={{ backgroundColor: 'rgba(125, 155, 23, 0.1)', color: '#7d9b17', fontWeight: 600 }} />
                        </Box>
                      </Box>

                      <Button
                        variant='contained'
                        fullWidth
                        onClick={() => {
                          setHandlEnrollModel(true)
                          setEnrollCourse(item)
                        }}
                        sx={{
                          backgroundColor: '#7d9b17',
                          color: 'white',
                          '&:hover': { backgroundColor: '#657d12' },
                          py: 1,
                          borderRadius: '8px',
                          fontWeight: 600
                        }}
                      >
                        Enroll Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {AllData?.length > 0 && (
            <Grid item xs={12} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalpage}
                shape='rounded'
                onChange={handlechangepage}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'black',
                    borderRadius: '12px'
                  },
                  '& .Mui-selected': {
                    color: 'black'
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={handlEnrollModel}
        onClose={() => setHandlEnrollModel(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '450px',
            borderRadius: '16px',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant='h5' sx={{ fontWeight: 700, color: '#7d9b17' }}>
            Confirm Enrollment
          </Typography>
          <IconButton onClick={() => setHandlEnrollModel(false)} size='small'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography variant='body1' sx={{ color: '#333', fontSize: '1.1rem', mt: 1 }}>
            Are you sure you want to enroll in the <strong>{enrollCourse?.title}</strong> course?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 2, justifyContent: 'center' }}>
          <Button
            variant='outlined'
            onClick={() => setHandlEnrollModel(false)}
            sx={{
              borderColor: '#7d9b17',
              color: '#7d9b17',
              borderRadius: '8px',
              px: 4,
              py: 1,
              fontWeight: 600,
              '&:hover': { borderColor: '#657d12', backgroundColor: 'rgba(125, 155, 23, 0.08)' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => enrollCourseStudent(enrollCourse)}
            sx={{
              backgroundColor: '#7d9b17',
              color: 'white',
              borderRadius: '8px',
              px: 4,
              py: 1,
              fontWeight: 600,
              '&:hover': { backgroundColor: '#657d12' }
            }}
          >
            Yes, Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
