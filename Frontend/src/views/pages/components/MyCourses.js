import React, { useState, useEffect } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import Link from 'next/link'
import { CardText, Progress } from 'reactstrap'
import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'
import MyFirstCourse from './MyFirstCourse'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

export default function MyCourses({ studentCourse }) {
  const [studentEnrollCourse, setStudentEnrollCourse] = useState([])

  const requestApiData = new Requests()
  const router = useRouter()
  const dispatch = useDispatch()
  const [enrollCourse, setEnrollCourse] = useState({})
  const user = JSON.parse(window.localStorage.getItem('userData'))
  const updateMyCourse = useSelector(state => state?.course?.updateMyCourse)

  useEffect(() => {
    const params = {
      studentID: user?.id
    }

    requestApiData
      .getEnrollCourse(params)
      .then(res => {
        if (res?.status === 200) {
          setStudentEnrollCourse(res?.data)
        }
      })
      .catch(err => {
        console.log('Error on Get Student Enroll Course', err)
      })
  }, [updateMyCourse, studentCourse, enrollCourse])

  const nextLesson = (courseSlug, courseId, nextTask) => {
    dispatch({ type: 'SELECTED_LESSON', payload: nextTask })
    router.replace(`/courses/${courseSlug}/${courseId}`)
  }

  const nextTasks = []
  studentEnrollCourse &&
    studentEnrollCourse.slice(0, 3).map((item, i) => {
      if (item.totalTask > item.completeTask.length) {
        for (let i = 1; i <= item.totalTask; i++) {
          if (item.completeTask.indexOf(`item_${i}`) === -1) {
            const result = item?.course_modules
              .map(module => ({
                items: module.items.filter(item => item.navNo.includes(`item_${i}`))
              }))
              .filter(module => module.items.length > 0)

            nextTasks.push(result[0]?.items[0])

            break
          }
        }
      } else {
        nextTasks.push('')
      }
    })

  function CallBack(clideData) {
    setEnrollCourse(clideData)
  }

  return studentEnrollCourse.length > 0 && nextTasks.length > 0 ? (
    <div className='learnningTimeBox2'>
      <div className='d-flex justify-content-between'>
        <h5 className='text-black'>Courses</h5>
      </div>
      <div className='py-50 pt-4'>
        {studentEnrollCourse &&
          studentEnrollCourse.slice(0, 3).map((item, i) => (
            <div key={i} className='row justify-content-between align-items-center py-3'>
              <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4 my-2  d-flex'>
                <div className='MyCoursesIconBox me-1'>
                  <img src={imgConst.f5} style={{ filter: "brightness(0) invert(1)" }} />
                </div>
                <div>
                  <h6 className='text-black'>{item.course_title}</h6>
                  <CardText style={{ fontSize: '12px', color: 'black' }}>by {item.course_enterprise}</CardText>
                </div>
              </div>

              <div className='col-sm-12 col-md-6 col-lg-6 col-xl-5 d-flex'>
                <Progress value={(item.completeTask.length / item.totalTask) * 100} />
                <span className='ps-4 align-items-center text-black'>
                  {item.completeTask.length ? parseInt(((item.completeTask.length) / item.totalTask) * 100) + '%' : `0%`}
                </span>
              </div>
              {nextTasks[i] !== '' ? (
                <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3 text-black'>
                  Next up:
                  <CardText
                    className='cursor-pointer my-1 me-2'
                    onClick={() =>
                      nextLesson(
                        item?.course_slug,
                        item?.course_id,
                        nextTasks[i],
                        localStorage.setItem('courseId', item?._id)
                      )
                    }
                  >
                    {nextTasks[i].name}
                  </CardText>
                </div>
              ) : (
                <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3 text-black'>Completed</div>
              )}
            </div>
          ))}
      </div>
      <h5 className='text-end ' style={{ color: '#6282F0', cursor: 'pointer' }}>
        <Link href='/my-all-courses' style={{ textDecoration: 'none' }}>
          View all
          <HiArrowNarrowRight className='ms-1' />
        </Link>
      </h5>
    </div>
  ) : (
    <MyFirstCourse collBack={CallBack} />
  )
}
