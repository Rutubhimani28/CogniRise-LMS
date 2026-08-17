import React, { useEffect, useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'
import Requests from 'src/configs/axiosRequest'
import Link from 'next/link'

// ** Images
import imgConst from 'src/configs/imgConst'

export default function TopCourse() {
  const [totalCourse, setTotalCourse] = useState([])
  const requestApiData = new Requests()

  useEffect(() => {
    const id = localStorage.getItem('userData')
    let course = JSON.parse(id)
    requestApiData
      .topCourseCount(course)
      .then(res => {
        if (res?.status === 200) {
          let result = res?.data
          setTotalCourse(result?.data?.[0]?.items)
        }
      })
      .catch(err => {
        console.log('Error on Get Course ', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox2'>
      <div style={{ minHeight: '295.57px' }}>
        <h2 className='fw-bold pb-1 fs-3' style={{ color: '#7d9b17', fontSize: '20px' }}>
          Top Courses
        </h2>
        <div>
          {totalCourse?.slice(0, 3).map((item, i) => (
            <div key={i} className='d-flex justify-content-between align-items-center py-2'>
              <div className='my-1  d-flex '>
                <div className='notificationIconBox me-3'>
                  <img src={imgConst.topCourse} />
                </div>
                <div>
                  <h6 style={{ color: 'black' }}>{item?.title}</h6>
                  <CardText style={{ fontSize: '12px', letterSpacing: '1.0px', color: 'black' }}>
                    {item?.createdName}
                  </CardText>
                </div>
              </div>
              <div className='text-end'>
                <h6 style={{ color: '#6282F0', fontWeight: '500' }}>{item?.price}</h6>
                <CardText style={{ fontSize: '12px', letterSpacing: '1.0px', color: 'black' }}>
                  {item?.completeTask?.length > 0 ? item?.completeTask?.length + 1 : 0} Completed
                </CardText>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h6 className='text-end' style={{ color: '#3A5BCD', cursor: 'pointer' }}>
        <Link href='/enterprise-courses' style={{ textDecoration: 'none', color: '#3A5BCD' }}>
          View all
        </Link>
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}
