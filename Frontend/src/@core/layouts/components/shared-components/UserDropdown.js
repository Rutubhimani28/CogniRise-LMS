import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { toast } from 'react-hot-toast'
import { FaRegSun } from 'react-icons/fa'
import { HiArrowSmRight } from 'react-icons/hi'
import { MdOutlineNotificationsActive } from 'react-icons/md'
import { useSelector } from 'react-redux'
import {
  Collapse,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap'
import Requests from 'src/configs/axiosRequest'
import imgConst from 'src/configs/imgConst'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const UserDropdown = () => {
  const [notifData, setNotifData] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const requestApiData = new Requests()
  const user = JSON.parse(localStorage.getItem('userData'))
  const [GetData, setGetData] = useState([])

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  const ability = useContext(AbilityContext)

  let profileURL = '/'
  if (ability?.can('manage', 'student')) {
    profileURL = '/student-profile'
  } else if (ability?.can('manage', 'enterprise')) {
    profileURL = '/enterprise-profile'
  } else if (ability?.can('manage', 'admin')) {
    profileURL = '/admin-profile'
  }

  let settingURL = '/'
  if (ability?.can('manage', 'student')) {
    settingURL = '/student-setting'
  } else if (ability?.can('manage', 'enterprise')) {
    settingURL = '/enterprise-setting'
  } else if (ability?.can('manage', 'admin')) {
    settingURL = '/admin-setting'
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
  }

  const getNotify = async () => {
    let notifType = ''

    if (user.role === 'enterprise') {
      notifType = ['course_approve', 'course_enroll']
    } else if (user.role === 'admin') {
      notifType = ['course_create', 'course_update']
    } else if (user.role === 'student') {
      notifType = 'course_approve'
    }

    const payload = {
      type: notifType
    }
    requestApiData.getNotification(payload).then(res => {
      if (res?.status === 200) {
        setNotifData(res.data)
      }
    })
  }

  useEffect(() => {
    getNotify()
  }, [])

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  const toggle = () => setIsOpen(!isOpen)

  function PaperComponent(props) {
    return (
      <Draggable handle='#draggable-dialog-title' cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    )
  }
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handledeleteAccount = () => {
    performance.mark('beforeRender')
    handleLogout()

    router.replace('/')
    setOpen(false)
    performance.mark('afterrender')
  }

  //Notification item course Enrollment

  // Notification item view function
  const handlechangenotification = el => {
    const payload = {
      _id: el._id,
      notificationView: user.id
    }
    requestApiData.updatenotification(payload).then(res => {
      if (res?.status === 200) {
        let result = res.data?.data
        const courseid = res?.data?.data?.courseId
        const updatenotification = notifData.map(item => (item.courseId == courseid ? result : item))
        setNotifData(updatenotification)
        if (user.role === 'enterprise') {
          router.push('/')
        } else if (user.role === 'admin') {
          router.push('/admin-courses')
        } else if (user.role === 'student') {
          router.push('/')
        }
      }
    })
  }

  // Notification clear all button function
  const handleClearAll = () => {
    notifData.map(el => {
      let datas = {
        _id: el._id,
        clearNotification: user.id
      }
      requestApiData.updatenotification(datas).then(res => {
        if (res?.status === 200) {
          getNotify()
        }
      })
    })
  }

  const getCount = () => {
    let count = 0

    if (notifData && notifData.length > 0) {
      for (const el of notifData) {
        if (el.clearNotification?.indexOf(user.id) === -1 && el.notificationView?.indexOf(user.id) === -1) {
          count++
        }
      }
    }

    return count
  }

  const connectwallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        if (GetData?.profile?.wallet) {
          toast.success(
            ` You are Connected :${GetData?.profile?.wallet.substring(0, 5)}--${GetData?.profile?.wallet.substring(36)}`
          )
        }
      } catch (error) {
        toast.error("wallet_requestPermissions' already pending")
      }
    } else {
      router.push('https://metamask.io/')
    }
  }

  const currentwalletconnected = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setwalletaddress(accounts[0])
        }
      } catch (error) {
        console.log(error.message)
      }
    } else {
    }
  }

  const userApi = () => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData.getUserById(createdBy.id).then(res => {
      if (res?.status === 200) {
        setGetData(res.data)
      }
    })
  }

  useEffect(() => {
    userApi()
    currentwalletconnected()
  }, [])

  return (
    <Fragment>
      <Navbar className=' py-4' expand='md'>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ms-auto d-flex flex-column flex-md-row align-items-center' navbar>
            {user.role === 'student' ? (
              <NavItem className='menu text-center my-1 position-relative'>
                <Link
                  href='/Course-listing'
                  className='text-decoration-none text-black my-1 me-md-5 me-sm-0 fs-5  menu-name'
                >
                  Course
                </Link>
              </NavItem>
            ) : user.role === 'admin' ? (
              <NavItem className='menu text-center my-1 position-relative'>
                <Link
                  href='/admin-category'
                  className='text-decoration-none text-black my-1 me-md-5 me-sm-0  fs-5 menu-name'
                >
                  Category
                </Link>
              </NavItem>
            ) : (
              ''
            )}

            {/* About navigation menu  */}
            <NavItem className=' menu position-relative'>
              <div className='my-1 me-md-5 me-sm-0 fs-5 text-black menu-name cursor-pointer text-center '>About</div>
              <div className='menudisplay'>
                <div className='menuitem d-md-flex'>
                  <div className='menu-background-color menu-collapse-width ps-lg-2 ps-sm-0'>
                    <ul className='list-unstyled text-start'>
                      <li className='pt-lg-3 pt-sm-0'>
                        <h4 className='text-black'>Connect with us</h4>
                      </li>
                      <li className='py-2 text-black'>@collegedao_hub</li>
                      <li className='py-2 text-black'>
                        <img src={''} className='pe-2' />
                        collegedao.io/discord
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
                  <div className='p-3  aboutmenu-box menu-background-color menu-collapse-width'>
                    <div className='d-flex'>
                      <ul className='list-unstyled text-start ps-2'>
                        <h4 className='text-black cur'>About</h4>
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
              </div>
            </NavItem>

            {/* Academy navigation menu  */}
            <NavItem className='menu position-relative'>
              <div className='my-1 me-md-5 me-sm-0 fs-5 text-black menu-name cursor-pointer text-center'>Academy</div>
              <img src={''} className='menuitem-triangle d-none d-md-block' />
              <div className='menudisplay'>
                <div className='menuitem d-md-flex flex-column flex-md-row'>
                  {/* Left Section */}
                  <div className='pe-md-4 menu-collapse-width'>
                    <ul className='list-unstyled text-start px-3 px-md-4 py-2 '>
                      <li className='py-2'>
                        <h4 className='text-black'>Get Started</h4>
                      </li>
                      <li className='py-2 text-black'>Introduction to Blockchain</li>
                      <li className='py-2 text-black'>Decentralized Finance</li>
                      <li className='py-2 text-black'>Smart Contracts</li>
                      <li className='py-2 text-black'>Non-Fungible Tokens</li>
                    </ul>
                  </div>

                  {/* Right Section */}

                  <div
                    className={`${
                      user.role === 'enterprise' ? 'enterprise-series' : 'series-space'
                    }  menu-collapse-width ps-md-3 p-3 pe-md-5   aboutmenu-box text-start menu-background-color`}
                  >
                    <div>
                      <h4 className='ps-md-5 pb-3 text-black'>Course Series</h4>
                      <div className='d-flex align-items-center mb-3'>
                        <img
                          src={imgConst.abouticon1}
                          className='ps-2 ps-md-4 rounded-3'
                          style={{ width: '80px', height: '60px' }}
                        />
                        <div className='ms-2'>
                          <h6 className='text-black mb-0'>
                            Data Track <HiArrowSmRight />
                          </h6>
                          <p className='text-black mb-0'>Lorem ipsum dolor sit</p>
                        </div>
                      </div>
                      <div className='d-flex align-items-center'>
                        <img
                          src={imgConst.abouticon2}
                          className='ps-2 ps-md-4 rounded-3'
                          style={{ width: '80px', height: '60px' }}
                        />
                        <div className='ms-2'>
                          <h6 className='text-black mb-0'>
                            Development Track <HiArrowSmRight />
                          </h6>
                          <p className='text-black mb-0'>Lorem ipsum dolor sit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </NavItem>

            {/* Notification navigation menu  */}
            <UncontrolledDropdown nav inNavbar className='text-canter '>
              <DropdownToggle nav className='z-9999 text-sm-center text-start'>
                <Button className='bg-transparent border-0 my-1 me-3 fs-5 menu-name position-relative p-0'>
                  <MdOutlineNotificationsActive className='text-black' style={{ fontSize: '25px' }} />
                  <span className='text-black position-absolute top-0 start-100 translate-middle badge rounded-circle  bg-denger p-1'>
                    {getCount()}
                  </span>
                </Button>
              </DropdownToggle>

              <DropdownMenu className='menuNotification m-0 p-0'>
                <div className='d-flex flex-column' style={{ height: '500px', overflowY: 'auto' }}>
                  <div>
                    <p className='ps-3 my-3 text-black'>Notifications</p>
                  </div>
                  <div className='text-black'>
                    {notifData && notifData.length > 0
                      ? notifData.map((el, i) => {
                          if (el.clearNotification?.indexOf(user.id) === -1) {
                            return (
                              <div key={i}>
                                {user.role === 'enterprise' &&
                                  el.createdBy === user.id &&
                                  (el.type === 'course_approve' ? (
                                    <>
                                      <div
                                        key={i}
                                        className={
                                          el.notificationView.indexOf(user.id) === -1
                                            ? 'noti-item noti-noview'
                                            : 'noti-item noti-view'
                                        }
                                        onClick={() => {
                                          handlechangenotification(el)
                                        }}
                                      >
                                        <div className='text-black'>{el.courseName} course is approved</div>
                                        {el.notificationView.indexOf(user.id) === -1 ? (
                                          <span className='bg-danger noti-buble'></span>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        key={i}
                                        className={
                                          el.notificationView.indexOf(user.id) === -1
                                            ? 'noti-item noti-noview'
                                            : 'noti-item noti-view'
                                        }
                                        onClick={() => {
                                          handlechangenotification(el)
                                        }}
                                      >
                                        <div className='text-black'>{el.courseName} course is enrolled</div>
                                        {el.notificationView.indexOf(user.id) === -1 ? (
                                          <span className='bg-danger noti-buble'></span>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    </>
                                  ))}
                                {user.role === 'admin' &&
                                  (el.type === 'course_create' ? (
                                    <>
                                      <div
                                        key={i}
                                        className={
                                          el.notificationView.indexOf(user.id) === -1
                                            ? 'noti-item noti-noview'
                                            : 'noti-item noti-view'
                                        }
                                        onClick={() => {
                                          handlechangenotification(el)
                                        }}
                                      >
                                        <div className='text-black'>{el.courseName} course is request to approval</div>
                                        {el.notificationView.indexOf(user.id) === -1 ? (
                                          <span className='bg-danger noti-buble'></span>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        key={i}
                                        className={
                                          el.notificationView.indexOf(user.id) === -1
                                            ? 'noti-item noti-noview'
                                            : 'noti-item noti-view'
                                        }
                                        onClick={() => {
                                          handlechangenotification(el)
                                        }}
                                      >
                                        <div className='text-black'>
                                          {el.courseName} course is updated and request to approval
                                        </div>
                                        {el.notificationView.indexOf(user.id) === -1 ? (
                                          <span className='bg-danger noti-buble'></span>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    </>
                                  ))}
                                {user.role === 'student' && (
                                  <>
                                    <div
                                      key={i}
                                      className={
                                        el.notificationView.indexOf(user.id) === -1
                                          ? 'noti-item noti-noview'
                                          : 'noti-item noti-view'
                                      }
                                      onClick={() => {
                                        handlechangenotification(el)
                                      }}
                                    >
                                      <div className='text-black'>
                                        {el?.courseName}{' '}
                                        {el?.approvals === 'course_update' ? 'course is update' : 'course is publish'}
                                      </div>
                                      {el.notificationView.indexOf(user.id) === -1 ? (
                                        <span className='bg-danger noti-buble'></span>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          }
                        })
                      : 'None'}
                  </div>
                </div>
                <div>
                  <p
                    className='w-100 m-0 text-center text-black py-3'
                    onClick={() => handleClearAll()}
                    style={{ cursor: 'pointer' }}
                  >
                    Clear All
                  </p>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* Setting navigation menu */}
            <NavItem className='menu position-relative text-center'>
              <Button className='bg-transparent text-black border-0 my-1 me-3 z-9999 fs-5  menu-name'>
                <FaRegSun />
              </Button>
              <img src={imgConst.triangle} className='menuitem-triangle d-none' />
              <div
                className={`${user.role === 'admin' ? 'menuForLogoutBtn' : 'menuSettingdisplay'}`}
                style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
              >
                <div>
                  {user.role === 'admin' ? (
                    <ul className='list-unstyled text-center bg-white rounded py-1'>
                      <li
                        className='py-2'
                        style={{ cursor: 'pointer', fontSize: '120%' }}
                        variant='outlined'
                        onClick={handleClickOpen}
                      >
                        <h5 className='text-black'>Logout</h5>
                      </li>
                    </ul>
                  ) : user.role === 'enterprise' ? (
                    <ul className='list-unstyled text-center px-4 py-4'>
                      <li className='py-2'>
                        <h5>
                          <Link href={settingURL} className='text-decoration-none text-black'>
                            <span className='text-black'>Settings</span>
                          </Link>
                        </h5>
                      </li>

                      <li className='py-2'>
                        <h5>
                          <Link href={profileURL} className='text-decoration-none text-black'>
                            <span className='text-black'>Profile</span>
                          </Link>
                        </h5>
                      </li>

                      <li
                        className='py-2'
                        style={{ cursor: 'pointer', fontSize: '120%' }}
                        variant='outlined'
                        onClick={handleClickOpen}
                      >
                        <h5 className='text-black'>Logout</h5>
                      </li>
                    </ul>
                  ) : user.role === 'student' ? (
                    <ul className='list-unstyled text-center px-4 py-4'>
                      <li className='py-2'>
                        <h5>
                          <Link href={settingURL} className='text-decoration-none text-black'>
                            Settings
                          </Link>
                        </h5>
                      </li>

                      <li className='py-2'>
                        <h5>
                          <Link href={profileURL} className='text-decoration-none text-balck'>
                            Profile
                          </Link>
                        </h5>
                      </li>

                      <li className='py-2 text-black'>
                        <h5 onClick={connectwallet}>My wallet</h5>
                      </li>
                      {/* 
                      <li
                        className='py-2'
                        style={{ cursor: 'pointer', fontSize: '120%' }}
                        variant='outlined'
                        onClick={handleClickOpenprobleum}
                      >
                        <h5 className='text-black'>Report a problem</h5>
                      </li> */}

                      <li
                        className='py-2'
                        style={{ cursor: 'pointer', fontSize: '120%' }}
                        variant='outlined'
                        onClick={handleClickOpen}
                      >
                        <h5 className='text-black'>Logout</h5>
                      </li>
                    </ul>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      {/* logout model */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        PaperProps={{
          style: {
            backgroundColor: 'white',
            borderRadius: '12px'
          }
        }}
        aria-labelledby='draggable-dialog-title'
        size='lg'
      >
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            boxSizing: 'border-box',
            marginBlock: '20px'
          }}
          className='mx-auto'
        >
          <DialogContent>
            <DialogContentText className='text-center text-black fs-6 text-break'>
              Are you sure you want to log out ?
            </DialogContentText>
          </DialogContent>

          <DialogActions className='d-flex flex-wrap justify-content-center justify-content-md-between w-100 mt-3'>
            <Button className='mx-3 px-3 beforeLoginbtn' onClick={handleClose}>
              Cancel
            </Button>
            <Button className='mx-3 px-3 beforeLoginbtn' onClick={handledeleteAccount}>
              Logout
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* course model */}
      {/* <Dialog open={coursModel} onClose={() => setCoursModel(true)} aria-labelledby='draggable-dialog-title' size='lg'>
        <div>
          <form ref={form} onSubmit={sendEmail}>
            <DialogContent>
              <div>
                <div className=' sliderImage'>
                  <img src={imgConst.bitcoin} width='100%' />
                </div>
                <div>
                  <h4 className='fw-bolder fs-4 my-3 px-2 text-light' style={{ textTransform: 'capitalize' }}>
                    {notificationCours?.title}
                  </h4>
                </div>
                <div>
                  <p style={{ fontSize: '20px' }} className='mb-2 px-2'>
                    {notificationCours?.description}
                  </p>
                </div>
              </div>
            </DialogContent>
            <div className='d-flex mb-5 mx-4'>
              <div className='justify-center align-center'>
                <button
                  className='enrollBtn'
                  onClick={() => {
                    enrollCourse(notificationCours)
                  }}
                >
                  Enroll
                </button>
              </div>
              <div>
                <button className='skipBtn' onClick={() => setCoursModel(false)} style={{ marginRight: '60%' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Dialog> */}
    </Fragment>
  )
}

export default UserDropdown
