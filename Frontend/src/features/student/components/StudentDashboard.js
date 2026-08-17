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
  Typography
} from '@mui/material'
import { Button } from 'reactstrap'

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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className='learnningTimeBox' alignItems={'center'} sx={{ minHeight: '110px', mr: { md: 1 } }}>
            <Typography variant='subtitle1' sx={{ fontSize: 20, color: '#7d9b17' }}>
              Continue:
            </Typography>
            <Typography className='fw-bolder text-black courseText fs-5 text-decoration-none'>
              {lastCourse?.course_details?.title || 'Not Start Any Course'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className='learnningTimeBox' alignItems={'center'} sx={{ ml: { md: 1 } }}>
            <Typography variant='subtitle1' sx={{ fontSize: 20, color: '#7d9b17' }}>
              Progress:
            </Typography>
            <Typography className='fw-bolder text-black hourseText '>
              {lastCourse?.completeTaskDuration?.toFixed(2) || 0} hrs this week.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ my: 4, mx: 2 }}>
        <Grid container>
          <Grid item xs={12}>
            <MyCourses studentCourse={studentCourse} />
          </Grid>
        </Grid>
      </Box>

      {allCourse.length > 0 && (
        <Box className='learnningTimeBox blackbox'>
          <Carousel>
            {allCourse.map((item, i) => (
              <Carousel.Item key={i}>
                <Grid container spacing={3} className='p-2 px-5'>
                  <Grid item xs={12} md={5}>
                    <Typography className='fw-bolder fs-1' sx={{ textTransform: 'capitalize', color: '#7d9b17' }}>
                      {item?.title}
                    </Typography>
                    <Typography sx={{ fontSize: 20, minHeight: 180 }} className='informationText text'>
                      {item?.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={7} className='sliderImage'>
                    <img src={imgConst.bitcoin} alt='Course' height='100%' width='100%' />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display='flex' gap={2}>
                      <Button
                        className='enrollBtn'
                        onClick={() =>
                          item.preRequisites.length === 0
                            ? (setHandlEnrollModel(true), setEnrollCourse(item))
                            : functioncheck(item)
                        }
                      >
                        Enroll
                      </Button>
                      <Button className='skipBtn' onClick={() => skipCourse(item._id)} sx={{ mr: 'auto' }}>
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
        fullWidth
        maxWidth='sm' // Changed to 'sm' for better mobile responsiveness
        PaperProps={{
          sx: {
            height: { xs: 'auto', md: '30%' }, // Auto height on small devices, 30% on medium and above
            borderRadius: 3,
            p: { xs: 2, sm: 3 } // Responsive padding
          }
        }}
      >
        <DialogTitle
          className='addHeadingColor'
          sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, textAlign: 'center' }} // Responsive font size
        >
          Confirm Enrollment
        </DialogTitle>

        <DialogContent>
          <Box textAlign='center' mt={2}>
            <Typography
              className='text-black'
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} // Responsive text size
            >
              {`Are you sure you want to enroll in ${enrollCourse?.title} course?`}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Button
            onClick={() => setHandlEnrollModel(false)}
            className='px-5 me-2 beforeLoginbtn'
            sx={{ minWidth: { xs: '100px', sm: '150px' }, mb: { xs: 1, sm: 0 } }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => enrollCourseStudent(enrollCourse)}
            className='px-5 beforeLoginbtn'
            sx={{ minWidth: { xs: '100px', sm: '150px' }, mt: { xs: 4, sm: 0 } }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
