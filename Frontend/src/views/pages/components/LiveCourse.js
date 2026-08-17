import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'

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
    <div className='learnningTimeBox ' style={{ height: '95%' }}>
      <h6 style={{ fontSize: '14px', color: '#7d9b17', fontWeight: 'bold' }}>Live Courses</h6>
      <h2 style={{ color: 'black', fontWeight: 'bold' }} className='fw-bolder fs-4'>
        {totalCourse === '' ? 0 : totalCourse?.total}
      </h2>
    </div>
  )
}
