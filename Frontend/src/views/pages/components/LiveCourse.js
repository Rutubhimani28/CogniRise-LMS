import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'

import imgConst from 'src/configs/imgConst'

export default function LiveCourse() {
  const [totalCourse, setTotalCourse] = useState('')
  const requestApiData = new Requests()
  useEffect(() => {
    const id = localStorage.getItem('userData')
    let graduate = JSON.parse(id)
    requestApiData
      .getTotalCourse(graduate)
      .then(res => {
        if (res?.status === 200) {
          let result = res?.data.data[0]
          setTotalCourse(result)
        }
      })

      .catch(err => {
        console.log('Error on Get Graduate ', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex align-items-center justify-content-between' style={{ height: '100%', padding: '20px' }}>
      <div className='d-flex align-items-center'>
        <div className='iconBox me-3 d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px' }}>
          <img src={imgConst.videoIcon} style={{ width: '24px', filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)' }} />
        </div>
        <div>
          <h6 style={{ fontSize: '15px', color: '#7d9b17', fontWeight: '600', margin: 0, paddingBottom: '4px' }}>Live Courses</h6>
          <h2 style={{ color: '#2F2B3D', fontWeight: '700', margin: 0 }} className='fs-3'>
            {totalCourse === '' ? 0 : totalCourse?.total}
          </h2>
        </div>
      </div>
      <div>
        <img src={imgConst.Graph} style={{ width: '80px', filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)' }} />
      </div>
    </div>
  )
}

