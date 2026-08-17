import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'
import imgConst from 'src/configs/imgConst'

export default function EnrolledSuper() {
  const requestApiData = new Requests()
  const [allCourse, setAllCourse] = useState([])

  useEffect(() => {
    requestApiData
      .getAllEnrollment()
      .then(res => {
        if (res?.status === 200) {
          setAllCourse(res?.data)
        }
      })
      .catch(err => {
        console.log('Error on Get Student Enroll Course', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex align-items-center justify-content-between'>
      <div>
        <h6 className='text-start' style={{ fontSize: '14px', color: '#7d9b17' }}>Enrolled</h6>
        <h4 className='text-black fw-bolder text-start' style={{ marginBottom: '0' }}>
          {allCourse.length}
        </h4>
      </div>
      <div>
        <img
          src={imgConst.graph2}
          style={{
            filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
          }}
          alt=''
        />
      </div>
    </div>
  )
}
