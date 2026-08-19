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
        <div className='iconBox me-3 d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px', backgroundColor: 'rgba(125, 155, 23, 0.1)', borderRadius: '12px' }}>
          <img src={imgConst.icon2} style={{ width: '24px', filter: 'invert(53%) sepia(50%) saturate(452%) hue-rotate(42deg) brightness(96%) contrast(89%)' }} />
        </div>
        <div>
          <h6 style={{ fontSize: '15px', color: 'black', fontWeight: '600', margin: 0, paddingBottom: '4px' }}>Enrolled</h6>
          <h2 style={{ color: '#2F2B3D', fontWeight: '700', margin: 0 }} className='fs-3'>
            {totalEnrollment?.data ? totalEnrollment?.data : 0}
          </h2>
        </div>
      </div>
    </div>
  )
}

