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

  useEffect(() => {
    if (!router.isReady) return

    const id = router?.query?.cid
    dispatch({ type: 'COURSE_ID', payload: id })

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

  return (
    <div>
      <Grid spacing={6} container>
        <Grid item xs={12} md={3} sm={12}>
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
          ) : (
            <QuizContent
              courseName={courseData?.title}
              instructor={courseData?.createdName}
              lesson={itemNo + '/' + courseData?.totalItems}
              data={navigationData?.data}
            />
          )}

          <div className='d-flex justify-content-between align-items-center'>
            {itemNo > 1 ? (
              <Button className='beforeLoginbtn my-1 me-3 px-4 mt-3' onClick={() => handlePreClick()}>
                Previous
              </Button>
            ) : (
              ''
            )}
            {itemNo + 1 < totalItem ? (
              <Button className='beforeLoginbtn my-1 me-3 px-4 mt-3' onClick={() => handleNextClick()}>
                Next
              </Button>
            ) : (
              ''
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
