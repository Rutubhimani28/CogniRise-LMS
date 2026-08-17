import Link from 'next/link'
import React from 'react'
import { Button, CardText } from 'reactstrap'

export const StudentQuizView = () => {
  return (
    <div className='course-video-wrap'>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className='course-video-heading'>Quiz 1: Smart Contracts</h2>
        <p>Blockchain 101: Quiz 1</p>
      </div>
      <h6 className='video-small-heading'>
        Powered By: <span className='color-change'>Chainlink</span> and{' '}
        <span className='color-change'>Blockchain @ Berkeley</span>
      </h6>

      <CardText className='video-content'>
        Assuming you are writing a smart contract for ABC123 in Solidity etc. Answer this question. Assuming you are
        writing a smart contract for ABC123 in Solidity etc. Answer this question. Assuming you are writing a smart
        contract for ABC123 in Solidity etc. Answer this question.{' '}
      </CardText>

      <div className='form-check'>
        <input className='form-check-input' type='radio' name='option' id='flexRadioDefault1' />
        <label className='form-check-label' htmlFor='flexRadioDefault1'>
          Option 1 is awseome
        </label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type='radio' name='option' id='flexRadioDefault2' />
        <label className='form-check-label' htmlFor='flexRadioDefault2'>
          Option 2 is awseome
        </label>
      </div>
      <div className='form-check'>
        <input className='form-check-input' type='radio' name='option' id='flexRadioDefault3' defaultChecked />
        <label className='form-check-label' htmlFor='flexRadioDefault3'>
          Option 3 is awseome
        </label>
      </div>

      <div className='d-flex justify-content-end align-items-center'>
        <Link href='/'>
          <Button className='LoginBtn my-1 me-3 px-5'>Next</Button>
        </Link>
      </div>
    </div>
  )
}
