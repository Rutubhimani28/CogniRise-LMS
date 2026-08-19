import React, { useState } from 'react'
import { useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'

// ** Images
import imgConst from 'src/configs/imgConst'

export default function StudentSuper() {
  const [student, setStudent] = useState([])
  const requestApiData = new Requests()

  useEffect(() => {
    requestApiData
      .getUser()
      .then(res => {
        setStudent(res?.data && res?.data?.filter(item => item?.role == 'student'))
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex'>
      <div className='iconBox iconBoxLinear me-2'>
        <img
          src={imgConst.icon}
          style={{
           filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
          }}
        />
      </div>
      <div>
        <h6 style={{ color: 'black' }}>Students</h6>
        <h5 style={{ color: 'black' }}>{student.length}</h5>
      </div>
      <div>
        <img
          src={imgConst.Graph_i}
          width='80px'
          style={{
            filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
          }}
        />
      </div>
      <div>{/* <img src={imgConst.Graph_i} width='80px' /> */}</div>
    </div>
  )
}
