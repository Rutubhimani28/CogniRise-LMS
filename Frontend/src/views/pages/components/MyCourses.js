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
  const [user, setUser] = useState(null)
  const updateMyCourse = useSelector(state => state?.course?.updateMyCourse)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(JSON.parse(window.localStorage.getItem('userData')))
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      const params = {
        studentID: user.id
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
    }
  }, [user, updateMyCourse, studentCourse, enrollCourse])

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

  return (
    <div className='learnningTimeBox2' style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h5 className='text-black m-0' style={{ fontWeight: 700 }}>My Courses</h5>
        <button
          onClick={() => router.push('/Course-listing')}
          style={{ backgroundColor: '#7d9b17', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
        >
          Explore Courses
        </button>
      </div>

      {studentEnrollCourse.length > 0 ? (
        <>
          <div className='py-2'>
            {studentEnrollCourse.slice(0, 3).map((item, i) => (
              <div key={i} className='row justify-content-between align-items-center py-3 border-bottom'>
                <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4 my-2 d-flex align-items-center'>
                  <div className='MyCoursesIconBox me-3' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
                    <img src={imgConst.f5} style={{ filter: "brightness(0) invert(1)", width: '20px' }} />
                  </div>
                  <div>
                    <h6 className='text-black m-0' style={{ fontWeight: 600 }}>{item.course_title}</h6>
                    <CardText style={{ fontSize: '12px', color: '#777', margin: 0 }}>by {item.course_enterprise}</CardText>
                  </div>
                </div>

                <div className='col-sm-12 col-md-6 col-lg-6 col-xl-5 d-flex align-items-center'>
                  <Progress value={item.totalTask ? (item.completeTask.length / item.totalTask) * 100 : 0} style={{ flexGrow: 1, height: '8px' }} color='success' />
                  <span className='ps-3 text-black' style={{ fontWeight: 600, minWidth: '50px' }}>
                    {item.totalTask ? parseInt(((item.completeTask.length) / item.totalTask) * 100) + '%' : `0%`}
                  </span>
                </div>

                <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3 text-black text-end'>
                  {nextTasks[i] ? (
                    <>
                      <span style={{ fontSize: '12px', color: '#777' }}>Next up:</span>
                      <CardText
                        className='cursor-pointer m-0'
                        style={{ fontWeight: 600, color: '#7d9b17' }}
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
                    </>
                  ) : item.totalTask === 0 ? (
                    <span style={{ fontWeight: 600, color: '#f39c12' }}>No content yet</span>
                  ) : item.completeTask?.length === item.totalTask ? (
                    <span style={{ fontWeight: 600, color: '#28a745' }}>Completed</span>
                  ) : (
                    <span style={{ fontWeight: 600, color: '#7d9b17' }}>Start Course</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className='text-end mt-3'>
            <Link href='/my-all-courses' style={{ textDecoration: 'none', color: '#7d9b17', fontWeight: 600 }}>
              View all
              <HiArrowNarrowRight className='ms-1' />
            </Link>
          </div>
        </>
      ) : (
        <div className='text-center py-5'>
          <p style={{ color: '#777', marginBottom: '20px' }}>You haven't enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  )
}

