import React from 'react'

// ** Images
import imgConst from 'src/configs/imgConst'

export default function LearninigTime() {
  return (
    <div className='learnningTimeBox d-flex'>
      <div className='iconBox me-3'>
        <img src={imgConst.learningTime} width='24px' />
      </div>
      <div>
        <h6>Learning Time</h6>
        <h4>2h 37m</h4>
      </div>
    </div>
  )
}
