import React from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'

export default function CurrentCourse() {
  return (
    <div className='CurrentCourseBox learnningTimeBox d-flex align-items-center'>
      <div>
        <h6>Current Course</h6>
        <h4 className='text-dark' style={{ fontWeight: '700' }}>
          Smart Contracts 203
        </h4>
      </div>
      <div>
        <HiArrowNarrowRight className='display-5 text-dark ms-3' />
      </div>
    </div>
  )
}
