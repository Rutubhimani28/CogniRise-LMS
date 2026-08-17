import Link from 'next/link'
import React, { useState } from 'react'
import { HiArrowSmRight } from 'react-icons/hi'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Button } from 'reactstrap'
import imgConst from 'src/configs/imgConst'

export default function BeforeLoginHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div
      style={{
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        position: 'fixed',
        width: '100%',
        backgroundColor: 'white',
        zIndex: '9999'
      }}
    >
      <div
        className='container '
        style={{
          color: 'black !important',
          textAlign: 'center',
          zIndex: '9999'
        }}
      >
        <Navbar className='' expand='md'>
          <Link href='/'>
            <img src={imgConst.mainLogo} width={'100px'} />
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='ms-auto d-flex  md-flex-column align-items-center' navbar>
              <NavItem className=' menu position-relative'>
                <div className='my-1 me-5 fs-5 text-black menu-name '>About</div>
                <img src={''} className='menuitem-triangle ' />
                <div className='menudisplay'>
                  <div className='menuitem d-md-flex'>
                    <div className='menu-collapse-width menu-background-color mb-lg-0 mb-sm-5'>
                      <ul className='list-unstyled text-start px-lg-4 mt-lg-2'>
                        <li className='py-2'>
                          <h4 className='text-black'>Connect with us</h4>
                        </li>
                        <li className='py-2 text-black'>
                          {' '}
                          <img src={''} className='pe-2' />
                          @collegedao_hub
                        </li>
                        <li className='py-2 text-black'>
                          <img src={''} className='pe-2' />
                          collegedao.io/discord
                          <img src={''} className='ps-2' />
                        </li>
                        <li className='py-2 text-black'>
                          <img src={''} className='pe-2' />
                          t.me/collegedao
                        </li>
                        <li className='py-2 text-black'>
                          <img src={''} className='pe-2' />
                          @collegedao
                        </li>
                      </ul>
                    </div>
                    <div className='d-flex ms-lg-3 ms-sm-0 p-3 aboutmenu-box menu-collapse-width about-menu menu-background-color'>
                      <ul className='list-unstyled text-start ps-2'>
                        <h4 className='text-black'>About</h4>
                        <li className='py-2 text-black'>Our Story</li>
                        <li className='py-2 text-black'>Experience College DAO</li>
                        <li className='py-2 text-black'>Partners</li>
                        <li className='py-2 text-black'>The Roadmap</li>
                      </ul>
                      <div>
                        <img src={''} className='ps-4 rounded-3' />
                      </div>
                    </div>
                  </div>
                </div>
              </NavItem>
              <NavItem className=' menu position-relative'>
                <div className='my-1 me-lg-5 me-sm-0 fs-5  text-black menu-name'>Explore Courses</div>
                <img src={''} className='menuitem-triangle ' />
                <div className='menudisplay'>
                  <div className='menuitem'>
                    <div className='menu-collapse-width menu-background-color'>
                      <ul className='list-unstyled text-start px-4  me-4 py-4'>
                        <li className='py-2 menu-item-space'>
                          <h4 className='text-black'>Get Started</h4>
                        </li>
                        <li className='py-2 text-black'>Introduction to Blockchain</li>
                        <li className='py-2 text-black'>Decentralized Finance</li>
                        <li className='py-2 text-black'>Smart Contracts</li>
                        <li className='py-2 text-black'>Non-Fungible Tokens</li>
                      </ul>
                    </div>
                    <div className='menu-collapse-width menu-background-color ms-lg-3 ms-sm-0 p-lg-2 p-sm-3 pe-5 aboutmenu-box text-start d-inline'>
                      <div className='px-3 width-for-course'>
                        <h4 className='ps-lg-5  pb-3 text-black'>Course Series</h4>
                        <div className=''>
                          <div className='d-flex align-items-center'>
                            <img src={imgConst.abouticon1} className='ps-lg-4 ps-sm-0 rounded-3' />
                            <div>
                              <h6 className='text-black'>
                                Data Track <HiArrowSmRight />
                              </h6>
                              <p className='text-black'>Lorem ipsum dolor sit</p>
                            </div>
                          </div>
                          <div className='d-flex align-items-center'>
                            <img src={imgConst.abouticon2} className='ps-lg-4 ps-sm-0 rounded-3' />
                            <div>
                              <h6 className='text-black'>
                                Development Track <HiArrowSmRight />
                              </h6>
                              <p className='text-black'>Lorem ipsum dolor sit</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NavItem>
              <NavItem>
                <Link href='/login'>
                  <Button className='beforeLoginbtn my-1 me-3 ms-lg-0 ms-md-3 px-4'> Login </Button>
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/register'>
                  <Button className='beforeLoginbtn my-1 me-2 px-4'> Sign up </Button>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </div>
  )
}
