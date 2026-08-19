import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
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
import MenuBookIcon from '@mui/icons-material/MenuBook'

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
          let parsedModules = res?.data?.modules || []
          if (typeof parsedModules === 'string') {
            try { parsedModules = JSON.parse(parsedModules) } catch (e) { }
          } else if (Array.isArray(parsedModules) && parsedModules.length > 0 && typeof parsedModules[0] === 'string') {
            try { parsedModules = parsedModules.map(m => JSON.parse(m)) } catch (e) { }
          }
          setModuleData(parsedModules)
          setTotalItem(res?.data?.totalItems + 1)
          setNavigationData(parsedModules[0]?.items?.[0])
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
              <MenuBookIcon sx={{ fontSize: 60, color: 'rgba(125, 155, 23, 0.4)', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#2F2B3D', fontWeight: 600, mb: 1 }}>No content available yet</Typography>
              <Typography variant="body1" sx={{ color: '#6c757d' }}>This course doesn't have any lessons or quizzes at the moment.<br />Please check back later.</Typography>
            </Box>
          )}

          {(lessonData || navigationData?.id || navigationData?.data) && (
            <div className='d-flex justify-content-between align-items-center w-100 mt-4'>
              {itemNo > 1 ? (
                <Button
                  variant='contained'
                  onClick={() => handlePreClick()}
                  sx={{
                    backgroundColor: '#7d9b17',
                    color: 'white',
                    borderRadius: '8px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(125, 155, 23, 0.39)',
                    '&:hover': {
                      backgroundColor: '#6b8514',
                      boxShadow: '0 6px 20px rgba(125, 155, 23, 0.23)'
                    }
                  }}
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              {itemNo + 1 < totalItem ? (
                <Button
                  variant='contained'
                  onClick={() => handleNextClick()}
                  sx={{
                    backgroundColor: '#7d9b17',
                    color: 'white',
                    borderRadius: '8px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(125, 155, 23, 0.39)',
                    '&:hover': {
                      backgroundColor: '#6b8514',
                      boxShadow: '0 6px 20px rgba(125, 155, 23, 0.23)'
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  )
}
