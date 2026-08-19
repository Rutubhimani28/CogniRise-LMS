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
    <div className='learnningTimeBox d-flex align-items-center justify-content-between' style={{ height: '100%', padding: '20px' }}>
      <div className='d-flex align-items-center'>
        <div className='iconBox me-3 d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px' }}>
          <img src={imgConst.icon2} style={{ width: '24px', filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)' }} />
        </div>
        <div>
          <h6 style={{ fontSize: '15px', color: '#4f46e5', fontWeight: '600', margin: 0, paddingBottom: '4px' }}>Enrolled</h6>
          <h2 style={{ color: '#2F2B3D', fontWeight: '700', margin: 0 }} className='fs-3'>
            {totalEnrollment?.data ? totalEnrollment?.data : 0}
          </h2>
        </div>
      </div>
      <div>
        <img src={imgConst.graph2} style={{ width: '80px', filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)' }} />
      </div>
    </div>
  )
}

