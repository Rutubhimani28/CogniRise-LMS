import React, { useEffect, useState } from 'react'

import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'

export default function Graduate() {
  const [totalGraduate, setTotalGraduate] = useState([])
  const requestApiData = new Requests()

  useEffect(() => {
    const id = localStorage.getItem('userData')
    let graduate = JSON.parse(id)
    requestApiData
      .getTotalGraduate(graduate)
      .then(res => {
        if (res?.status === 200) {
          let result = res?.data.data[0]
          setTotalGraduate(result)
        }
      })
      .catch(err => {
        console.log('Error on Get Graduate ', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox d-flex' style={{ height: '95%' }}>
      <div className='iconBox me-2'>
        <img
          src={imgConst.graduate}
          width='24px'
          style={{
            filter: 'invert(41%) sepia(96%) saturate(600%) hue-rotate(27deg) brightness(93%) contrast(102%)'
          }}
        />
      </div>
      <div>
        <h6 style={{ fontSize: '14px', color: '#7d9b17', fontWeight: 'bold' }}>Graduates</h6>
        <h2 style={{ color: 'black', fontWeight: 'bold' }} className='fw-bolder fs-4'>
          {totalGraduate === undefined ? 0 : totalGraduate?.total}
        </h2>
      </div>
    </div>
  )
}
