import React, { useEffect, useState } from 'react'

// ** Images
import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'

export default function Student() {
  const [totalStudent, setTotalStudent] = useState('')
  const requestApiData = new Requests()

  useEffect(() => {
    const id = localStorage.getItem('userData')
    let student = JSON.parse(id)
    requestApiData
      .getTotalStudentCount(student)
      .then(res => {
        if (res?.status === 200) {
          let result = res?.data.data[0]
          setTotalStudent(result)
        }
      })
      .catch(err => {
        console.log('Error on Get Student ', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex align-items-center justify-content-between' style={{ height: '100%', padding: '20px' }}>
      <div className='d-flex align-items-center'>
        <div className='iconBox me-3 d-flex align-items-center justify-content-center' style={{ width: '48px', height: '48px', backgroundColor: 'rgba(125, 155, 23, 0.1)', borderRadius: '12px' }}>
          <img src={imgConst.icon} style={{ width: '24px', filter: 'invert(53%) sepia(50%) saturate(452%) hue-rotate(42deg) brightness(96%) contrast(89%)' }} />
        </div>
        <div>
          <h6 style={{ fontSize: '15px', color: 'black', fontWeight: '600', margin: 0, paddingBottom: '4px' }}>Students</h6>
          <h2 style={{ color: '#2F2B3D', fontWeight: '700', margin: 0 }} className='fs-3'>
            {totalStudent?.count ? totalStudent?.count : 0}
          </h2>
        </div>
      </div>
    </div>
  )
}

