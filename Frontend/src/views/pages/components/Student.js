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
    <div className='learnningTimeBox d-flex' style={{ height: '95%' }}>
      <div className='iconBox iconBoxLinear me-2'>
        <img
          src={imgConst.icon}
          style={{
            width: '40%',
            filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
          }}
        />
      </div>
      <div>
        <h6 style={{ color: '#7d9b17', fontWeight: 'bold' }}>Students</h6>
        <h4 style={{ color: 'black', fontWeight: 'bold' }}>{totalStudent?.count ? totalStudent?.count : 0}</h4>
      </div>
      <div>
        <img
          src={imgConst.Graph}
          width='80px'
          style={{
            filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
          }}
        />
      </div>
    </div>
  )
}
