import React, { useEffect, useState } from 'react'

import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'

export default function Enrolled() {
  const [totalEnrollment, setTotalEnrollment] = useState([])
  const requestApiData = new Requests()

  useEffect(() => {
    requestApiData
      .countEnrollment()
      .then(res => {
        if (res?.status === 200) {
          setTotalEnrollment(res?.data)
        }
      })
      .catch(err => {
        console.log('Error on Get Student Enroll Course', err)
      })
  }, [])

  return (
    <div
      className='CurrentCourseBox learnningTimeBox d-flex align-items-center justify-content-between'
      style={{ height: '95%' }}
    >
      <div>
        <h6 className='text-white'>Enrolled</h6>
        <h6 style={{ fontWeight: '700', fontSize: '24px', marginBottom: '0', color: 'white' }}>
          {totalEnrollment?.data}
        </h6>
      </div>
      <div>
        <img
          src={imgConst.graph2}
          style={{
            filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
          }}
        />
      </div>
    </div>
  )
}
