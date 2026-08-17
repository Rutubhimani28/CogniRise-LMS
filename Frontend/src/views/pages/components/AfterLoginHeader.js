import Link from 'next/link'
import React, { useState } from 'react'
import { Navbar } from 'reactstrap'

import imgConst from 'src/configs/imgConst'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

export default function AfterLoginHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const user = JSON.parse(localStorage.getItem('userData'))

  return (
    <div className='container exploreHeader' style={{ color: '#FFFFFF !important', textAlign: 'center' }}>
      {/*---------------------------------------------------- header ----------------------------------------------------*/}

      <Navbar className='mb-4' expand='md'>
        <Link href='/'>
          <img src={imgConst.mainLogo} width={'80px'} />
        </Link>
        <UserDropdown />
      </Navbar>
    </div>
  )
}
