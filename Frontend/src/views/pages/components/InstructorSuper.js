import React, { useEffect, useState } from 'react'
import Requests from 'src/configs/axiosRequest'

export default function InstructorSuper() {
  const requestApiData = new Requests()

  const [enterprise, setEnterprise] = useState([])

  useEffect(() => {
    requestApiData
      .getUser()
      .then(res => {
        setEnterprise(res?.data && res?.data.filter(item => item.role === 'enterprise'))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className='learnningTimeBox '>
      <h6 className='text-start' style={{ fontSize: '14px', color:'#7d9b17' }}>
        Instructors
      </h6>
      <h4 className='text-black fw-bolder text-start'>{enterprise?.length}</h4>
    </div>
  )
}
