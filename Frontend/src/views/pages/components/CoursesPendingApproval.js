import React, { useEffect, useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'
import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'
import moment from 'moment'
import Link from 'next/link'

export default function CoursesPendingApproval() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  const requestApiData = new Requests()

  useEffect(() => {
    requestApiData
      .courseRequest()
      .then(res => {
        if (res?.status === 200) {
          setCourses(res?.data)
        }
      })
      .catch(err => {
        console.log('Get all courses', err)
      })

    requestApiData
      .getCategories()
      .then(res => {
        if (res?.status === 200) {
          setCategories(res?.data)
        }
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  const getCategoryName = (categoryId) => {
    const found = categories.find(cat => cat._id === categoryId)
    return found ? found.name : categoryId
  }

  return (
    <div className='learnningTimeBox'>
      <div style={{ minHeight: '291.57px' }}>
        <h5
          className='fw-bold pb-1 '
          style={{ color: '#7d9b17', fontSize: window.innerWidth <= 600 ? '22px' : '30px' }}
        >
          Courses Pending Approval
        </h5>
        <div>
          {courses.slice(0, 3).map((course, i) => (
            <div key={i} className='d-flex justify-content-between align-items-center py-2'>
              <div className='my-1  d-flex '>
                <div className='notificationIconBox me-3'>
                  <img
                    src={imgConst.topCourse}
                    style={{
                      filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
                    }}
                  />
                </div>
                <div>
                  <h6 className='text-black'>{course.title}</h6>
                  <CardText className='text-black' style={{ fontSize: '12px', letterSpacing: '1.0px' }}>
                    By {course.createdName}
                  </CardText>
                </div>
              </div>
              <div className='text-end'>
                <h6 className='text-black' style={{ fontWeight: '500' }}>
                  {getCategoryName(course.category)}
                </h6>
                <CardText className='text-black' style={{ fontSize: '12px', letterSpacing: '1.0px' }}>
                  {moment(course.createdAt).format('MM/DD/YYYY')}
                </CardText>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h6 className='text-end pt-1' style={{ color: '#3a5bcd', cursor: 'pointer' }}>
        <Link
          className='text-default text-decoration-none'
          href={`/admin-courses`}  // Removed the curly braces since it's a static path
          style={{ color: '#3a5bcd' }}
          passHref
        >
          View all
        </Link>
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}
