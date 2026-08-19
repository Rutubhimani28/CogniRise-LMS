import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'
import imgConst from 'src/configs/imgConst'

export default function CorsesSuper() {
  const requestApiData = new Requests()
  const [allCourse, setAllCourse] = useState([])
  useEffect(() => {
    requestApiData
      .TotalCouses()
      .then(res => {
        if (res?.status === 200) {
          setAllCourse(res?.data && res?.data.filter(item => item.status === 'approve'))
        }
      })
      .catch(err => {
        console.log('Error on Get Enroll Course', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex'>
      <div className='iconBox me-2'>
        <img
          src={imgConst.graduate}
          width='24px'
          style={{
            filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
          }}
        />
      </div>
      <div>
        <h6 style={{ fontSize: '14px', color: '#7d9b17' }}>Courses</h6>
        <h4 className='text-black'>{allCourse.length}</h4>
      </div>
    </div>
  )
}

