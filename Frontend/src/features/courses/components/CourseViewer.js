import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import Requests from 'src/configs/axiosRequest'
import CourseContent from 'src/views/pages/components/CourseContent'
import LessonContent from 'src/views/pages/components/LessonContent'
import QuizContent from 'src/views/pages/components/QuizContent'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// ** Layout Import
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export const CourseViewer = () => {
  // api call
  const [courseData, setCourseData] = useState(null)
  const [lessonData, setLessonData] = useState(null)
  const getLessonData = useSelector(state => state?.course?.selectedLesson)

  const [moduleData, setModuleData] = useState([])
  const [totalItem, setTotalItem] = useState(0)
  const [itemNo, setItemNo] = useState(1)
  const [navigationData, setNavigationData] = useState({})

  const requestApiData = new Requests()

  const router = useRouter()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return

    const id = router?.query?.cid
    dispatch({ type: 'COURSE_ID', payload: id })

    setIsLoading(true)
    requestApiData
      .oneCourseRequest(id)
      .then(res => {
        if (res?.status === 200) {
          setCourseData(res?.data)
          setModuleData(res?.data?.modules)
          setTotalItem(res?.data?.totalItems + 1)
          setNavigationData(res?.data?.modules[0]?.items[0])
        }
      })
      .catch(err => {
        console.log('Course Preview', err)
      })
      .finally(() => setIsLoading(false))
  }, [router.isReady])

  useEffect(() => {
    if (!getLessonData) return

    setLessonData(getLessonData)
    setItemNo(parseInt((getLessonData?.navNo).split('_').pop()))
  }, [getLessonData])

  const handlePreClick = () => {
    setLessonData('')

    const result = moduleData
      .map(module => ({
        items: module.items.filter(item => item.navNo.includes(`item_${itemNo - 1}`))
      }))
      .filter(module => module.items.length > 0)
    setItemNo(itemNo - 1)
    setNavigationData(result[0]?.items[0])
  }

  const handleNextClick = () => {
    setLessonData('')

    const result = moduleData
      .map(module => ({
        items: module.items.filter(item => item.navNo.includes(`item_${itemNo + 1}`))
      }))
      .filter(module => module.items.length > 0)
    setItemNo(itemNo + 1)
    setNavigationData(result[0]?.items[0])
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#7d9b17' }} size={60} thickness={4} />
      </Box>
    )
  }

  return (
    <div>
      <Grid spacing={6} container>
        <Grid item xs={12} md={3} sm={12} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
          <CourseContent data={moduleData} />
        </Grid>

        <Grid item xs={12} md={9}>
          {lessonData ? (
            lessonData?.id && (lessonData?.id).split('_', 1) == 'lesson' ? (
              <LessonContent
                courseName={courseData?.title}
                instructor={courseData?.createdName}
                lesson={itemNo + '/' + courseData?.totalItems}
                data={lessonData?.data}
              />
            ) : (
              <QuizContent
                courseName={courseData?.title}
                instructor={courseData?.createdName}
                lesson={itemNo + '/' + courseData?.totalItems}
                data={lessonData?.data}
              />
            )
          ) : navigationData?.id && (navigationData?.id).split('_', 1) == 'lesson' ? (
            <LessonContent
              courseName={courseData?.title}
              instructor={courseData?.createdName}
              lesson={itemNo + '/' + courseData?.totalItems}
              data={navigationData?.data}
            />
          ) : navigationData?.data ? (
            <QuizContent
              courseName={courseData?.title}
              instructor={courseData?.createdName}
              lesson={itemNo + '/' + courseData?.totalItems}
              data={navigationData?.data}
            />
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '#636363 0px 2px 8px 0px' }}>
              <Typography variant="h6" className="text-black">No content available for this course yet.</Typography>
              <Typography variant="body2" className="text-black" sx={{ mt: 2 }}>Please check back later or contact the instructor.</Typography>
            </div>
          )}

          <div className='d-flex justify-content-between align-items-center w-100 mt-3'>
            {itemNo > 1 ? (
              <Button className='beforeLoginbtn my-1 me-3 px-4' onClick={() => handlePreClick()}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            {itemNo + 1 < totalItem ? (
              <Button className='beforeLoginbtn my-1 px-4' onClick={() => handleNextClick()}>
                Next
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
