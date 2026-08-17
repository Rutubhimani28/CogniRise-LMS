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
  IconButton
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { HiSearch, HiStar } from 'react-icons/hi'
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

  const handlechangepage = (e, p) => {
    setpage(p)
  }

  const requestApiData = new Requests()
  useEffect(() => {
    requestApiData.TotalCouses().then(res => {
      SetcardDetails(res.data)
      SetTotalcourse(res.data)
    })
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
    if (e.target.value === '') {
      SetcardDetails(Totalcourse)
    } else {
      requestApiData.searchCouses(e.target.value).then(res => {
        SetcardDetails(res.data)
      })
    }
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
    const updatedLevels = findslevel.map(item => (item.name === value ? { ...item, status: !item.status } : item))
    setfindslevel(updatedLevels)

    const selectedLevels = updatedLevels.filter(item => item.status).map(item => item.name)
    setFilterLevel(selectedLevels)

    applyFilters(selectedLevels, slider)
  }

  const applyFilters = (levels, duration) => {
    requestApiData.TotalCouses().then(res => {
      let filteredData = res.data

      if (levels.length > 0) {
        filteredData = filteredData.filter(item => levels.includes(item.level))
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
      <div style={{ boxShadow: ' rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: '0px' }}>
        <AfterLoginHeader />
      </div>
      <Grid container sx={{ padding: '0px 20px' }}>
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
          <Typography variant='h5' color='#7d9b17' sx={{ mb: 1 }}>
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
                    icon={<CheckBoxOutlineBlankIcon sx={{ color: 'black', borderRadius: '14px' }} />}
                    checkedIcon={<CheckBoxIcon sx={{ color: 'black', borderRadius: '14px' }} />}
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
          <Typography variant='h5' color='#7d9b17'>
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
          <Typography variant='h5' color='#7d9b17' sx={{ pt: 4 }}>
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
            py: 3
          }}
        >
          <Typography variant='h4' className='course-listing-heading addHeadingColor' gutterBottom>
            Explore Courses
          </Typography>

          <FormControl
            fullWidth
            sx={{ my: 2 }}
            variant='outlined'
            className='search-text-listing border border-dark rounded'
          >
            <OutlinedInput
              placeholder='Search Courses'
              sx={{ height: 60, color: 'black' }}
              id='outlined-adornment-weight'
              startAdornment={
                <InputAdornment position='start'>
                  <HiSearch size={18} className='text-black' />
                </InputAdornment>
              }
              onChange={searchCourse}
              aria-describedby='outlined-weight-helper-text'
              inputProps={{
                'aria-label': 'search',
                className: 'text-black bg-white '
              }}
            />
          </FormControl>

          <Grid container spacing={5}>
            {AllData?.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'white',
                    color: 'black'
                  }}
                  className='card-box'
                >
                  <CardMedia
                    component='img'
                    height='200'
                    image={imgConst[item.imageKey] || imgConst.bitcoin}
                    alt='Course image'
                  />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant='h6' className='card-Heading'>
                      {item.title}
                    </Typography>
                    <Typography variant='subtitle1' className='card-title text-black'>
                      {item.category}
                    </Typography>
                    <Typography variant='body2' className='Card-content'>
                      {item.description.substring(0, 40) + '...'}
                    </Typography>
                    <Typography variant='subtitle2' className='Card-content text-white'>
                      {item.rating} <HiStar /> {item.review} Reviews
                    </Typography>
                    <Button
                      variant='contained'
                      fullWidth
                      className='bg-white text-black'
                      onClick={() => {
                        setHandlEnrollModel(true)
                        setEnrollCourse(item)
                      }}
                      sx={{ mt: 2 }}
                    >
                      Enroll
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1
                    }}
                  >
                    <Typography className='text-black'>{item.level}</Typography>
                    <Typography className='text-black'>{item.courseLength}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

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
        </Grid>
      </Grid>

      <BootstrapDialog
        onClose={() => setHandlEnrollModel(false)}
        aria-labelledby='customized-dialog-title'
        open={handlEnrollModel}
        PaperProps={{
          sx: {
            width: '80%',
            height: '30%',
            background: 'white'
          }
        }}
      >
        <div className='p-3'>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            className='text-white'
            onClose={() => setHandlEnrollModel(false)}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p className='my-3 text-black'>{`Are you sure you want to enroll ${enrollCourse?.title} course ?`}</p>
            <div className='d-flex my-5 '>
              <Button className='px-5 beforeLoginbtn me-2' autoFocus onClick={() => setHandlEnrollModel(false)}>
                Cancel
              </Button>
              <Button autoFocus className='px-5 beforeLoginbtn me-2' onClick={() => enrollCourseStudent(enrollCourse)}>
                Yes
              </Button>
            </div>
          </div>
        </div>
      </BootstrapDialog>
    </div>
  )
}
