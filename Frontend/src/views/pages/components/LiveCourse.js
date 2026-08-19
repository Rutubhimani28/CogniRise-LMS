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
        <div className='iconBox me-3 d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px', backgroundColor: 'rgba(125, 155, 23, 0.1)', borderRadius: '12px' }}>
          <img src={imgConst.videoIcon} style={{ width: '24px', filter: 'invert(53%) sepia(50%) saturate(452%) hue-rotate(42deg) brightness(96%) contrast(89%)' }} />
        </div>
        <div>
          <h6 style={{ fontSize: '15px', color: 'black', fontWeight: '600', margin: 0, paddingBottom: '4px' }}>Live Courses</h6>
          <h2 style={{ color: '#2F2B3D', fontWeight: '700', margin: 0 }} className='fs-3'>
            {totalCourse === '' ? 0 : totalCourse?.total}
          </h2>
        </div>
      </div>
    </div>
  )
}

