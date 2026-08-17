import React from 'react'

import imgConst from 'src/configs/imgConst'

export default function MyProgress() {
  return (
    <div className='learnningTimeBox d-flex'>
      <div className='iconBox iconBoxLinear me-3'></div>
      <div>
        <h6>My Progress</h6>
        <h5>21 Tasks</h5>
      </div>
      <div>
        <img src={imgConst.Graph} width='80px' />
      </div>
    </div>
  )
}
