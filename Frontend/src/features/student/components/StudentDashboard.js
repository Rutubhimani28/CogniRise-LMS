import React, { useEffect, useState } from 'react'
import MyCourses from 'src/views/pages/components/MyCourses'
import imgConst from 'src/configs/imgConst'
import Carousel from 'react-bootstrap/Carousel'
import Requests from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogTitle,
  Grid,
  Box,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export const StudentDashboard = () => {
  const [lastCourse, setLastCourse] = useState([])
  const [allCourse, setAllCourse] = useState([])
  const [studentCourse, setStudentCourse] = useState([])
  const [handlEnrollModel, setHandlEnrollModel] = useState(false)
  const [enrollCourse, setEnrollCourse] = useState({})
  const [skipCourseId, setSkipCourseID] = useState([])
  const [enrollcourse, setEnrollcourse] = useState(false)
  const [allenrollmentcourse, setallenrollmentcourse] = useState([])
  const [courses, setcourses] = useState([])

  const requestApiData = new Requests()
  const student = JSON.parse(window.localStorage.getItem('userData'))

  useEffect(() => {
    const data = {
      id: localStorage.getItem('courseId')
    }
    requestApiData
      .getLastEnrollment(data)
      .then(res => {
        if (res?.status === 200) {
          setLastCourse(res?.data[0])
        }
      })
      .catch(err => {
        console.log('Error on Get Student Enroll Course', err)
      })
  }, [])

  useEffect(() => {
    requestApiData
      .getEnrollCourse({ studentID: student?.id })
      .then(res => {
        setallenrollmentcourse(res.data.map(el => el.course_id))
        res.data &&
          res.data.map(item => {
            skipCourseId.push(item.course_id)
          })
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [enrollcourse])

  // all course
  useEffect(() => {
    requestApiData
      .TotalCouses()
      .then(res => {
        if (res?.status === 200) {
          setAllCourse(res?.data)
          setcourses(res.data)
        }
      })
      .catch(err => {
        console.log(' Course', err)
      })
  }, [])

  useEffect(() => {
    skipCourseId?.length > 0 &&
      setTimeout(() => {
        requestApiData
          .courseRequestStudent(skipCourseId)
          .then(res => {
            if (res?.status === 200) {
              setAllCourse(res?.data)
            }
          })
          .catch(err => {
            console.log('Error on Get Enroll Course', err)
          })
      }, 200)
  }, [skipCourseId, enrollcourse])

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
          if (res.status === 200) {
            if (!res.data.message) {
              setStudentCourse(res)
              setHandlEnrollModel(false)
              setEnrollcourse(true)
              toast.success(`${item.title} enroll`)
            }
          }
          if (res.data.message) {
            setStudentCourse(res)
            setHandlEnrollModel(false)
            setEnrollcourse(true)
            toast.error(res.data.message)
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const skipCourse = ID => {
    setSkipCourseID([...skipCourseId, ID])
  }

  const functioncheck = item => {
    const preRequisites = item.preRequisites
    let data = preRequisites.filter(arr1Item => !allenrollmentcourse.includes(arr1Item))
    if (data.length == 0) {
      setHandlEnrollModel(true), setEnrollCourse(item)
    } else {
      let filter = courses.filter(item => data.includes(item._id))
      toast.error(` Oops:Please First enroll ${filter.map(item => item.title)} Course `)
    }
  }

  return (
    <Box className='studentAccountWrap header-root'>
      {/* Top Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className='learnningTimeBox' sx={{ minHeight: '80px', backgroundColor: 'white', p: 2 }}>
            <Typography variant='subtitle1' sx={{ fontSize: 16, color: '#7d9b17', fontWeight: 600 }}>
              Continue:
            </Typography>
            <Typography className='fw-bolder text-black courseText fs-6 text-decoration-none'>
              {lastCourse?.course_details?.title || 'Not Start Any Course'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className='learnningTimeBox' sx={{ minHeight: '80px', backgroundColor: 'white', p: 2 }}>
            <Typography variant='subtitle1' sx={{ fontSize: 16, color: '#7d9b17', fontWeight: 600 }}>
              Progress:
            </Typography>
            <Typography className='fw-bolder text-black hourseText fs-6'>
              {lastCourse?.completeTaskDuration?.toFixed(2) || 0} hrs this week.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ my: 3 }}>
        <MyCourses studentCourse={studentCourse} />
      </Box>

      {allCourse.length > 0 && (
        <Box className='learnningTimeBox' sx={{ backgroundColor: 'white', p: 2 }}>
          <Carousel>
            {allCourse.map((item, i) => (
              <Carousel.Item key={i}>
                <Grid container spacing={3} className='p-2 px-4'>
                  <Grid item xs={12} md={5}>
                    <Typography className='fw-bolder fs-4' sx={{ textTransform: 'capitalize', color: '#7d9b17', mb: 1 }}>
                      {item?.title}
                    </Typography>
                    <Typography sx={{ fontSize: 15, minHeight: 100 }} className='informationText text'>
                      {item?.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={7} className='sliderImage'>
                    <img src={imgConst.bitcoin} alt='Course' height='200px' width='100%' style={{ objectFit: 'cover', borderRadius: '12px' }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display='flex' gap={2} mt={2}>
                      <Button
                        variant='contained'
                        onClick={() =>
                          item.preRequisites.length === 0
                            ? (setHandlEnrollModel(true), setEnrollCourse(item))
                            : functioncheck(item)
                        }
                        sx={{
                          backgroundColor: '#7d9b17',
                          color: 'white',
                          borderRadius: '70px',
                          px: 4,
                          py: 1,
                          fontWeight: 700,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#4338ca' }
                        }}
                      >
                        Enroll
                      </Button>
                      <Button
                        variant='outlined'
                        onClick={() => skipCourse(item._id)}
                        sx={{
                          borderColor: '#7d9b17',
                          color: '#7d9b17',
                          borderRadius: '70px',
                          px: 4,
                          py: 1,
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)', borderColor: '#7d9b17' }
                        }}
                      >
                        Skip
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Carousel.Item>
            ))}
          </Carousel>
        </Box>
      )}

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
              '&:hover': { borderColor: '#4338ca', backgroundColor: 'rgba(79, 70, 229, 0.08)' }
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
              '&:hover': { backgroundColor: '#4338ca' }
            }}
          >
            Yes, Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

