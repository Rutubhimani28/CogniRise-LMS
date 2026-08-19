import React, { useEffect, useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'

import Requests from 'src/configs/axiosRequest'
import moment from 'moment'
import Link from 'next/link'

export default function EnterpriseApplicants() {
  const [enterprises, setEnterprises] = useState([])

  const requestApiData = new Requests()

  useEffect(() => {
    requestApiData
      .getUser({ role: 'enterprise' })
      .then(res => {
        if (res?.status === 200) {
          setEnterprises(res?.data)
        }
      })
      .catch(err => {
        console.log('Get all enterprise', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox'>
      <div style={{ minHeight: '295.57px' }}>
        <h2 className=' fw-bold pb-3' style={{ color: '#7d9b17' }}>
          Enterprise Applicants
        </h2>
        <div>
          {enterprises.slice(0, 3).map((item, i) => (
            <div key={i} className='my-4 ps-3 pt-1' style={{ borderLeft: '4px solid  #2c3e50' }}>
              <h6 className='text-black'>{item?.profile?.name}</h6>
              <CardText className='text-black' style={{ fontSize: '12px', letterSpacing: '1.0px' }}>
                Application Date {moment(item?.modifiedAt).format('MM/DD/YYYY')}
              </CardText>
            </div>
          ))}
        </div>
      </div>
      <h6 className='text-end' style={{ cursor: 'pointer', color: '#3a5bcd' }}>
        <Link className='text-default text-decoration-none' href={`/admin-enterprises`} style={{ color: '#3a5bcd' }}>
          View all
        </Link>
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}

