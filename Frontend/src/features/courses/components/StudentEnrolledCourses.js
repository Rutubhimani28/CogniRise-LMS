import React, { useState, useEffect } from 'react'
import { Button, CardText, Nav, NavItem, NavLink, Progress, TabContent, TabPane } from 'reactstrap'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, InstapaperShareButton } from 'react-share'
import imgConst from 'src/configs/imgConst'
import Requests from 'src/configs/axiosRequest'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Box, IconButton, Menu, MenuItem, Typography, Avatar } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { FaFacebookSquare, FaInstagram, FaLinkedin, FaTwitterSquare } from 'react-icons/fa'
import moment from 'moment'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export const StudentEnrolledCourses = () => {
  const [active, setActive] = useState('1')
  const [studentEnrollCourse, setStudentEnrollCourse] = useState([])
  const [anchorE2, setAnchorE2] = useState(null)
  const [certificateId, setCertificateID] = useState('')
  const openongoing = Boolean(anchorE2)

  const handleClickongoing = event => {
    setAnchorE2(event.currentTarget)
  }

  const handleCloseongoing = () => {
    setAnchorE2(null)
  }

  const [anchorE3, setAnchorE3] = useState(null)
  const opencompleted = Boolean(anchorE3)

  const handleClickcompleted = event => {
    setAnchorE3(event.currentTarget)
  }

  const handleClosecompleted = () => {
    setAnchorE3(null)
  }

  const requestApiData = new Requests()
  const router = useRouter()
  const dispatch = useDispatch()
  const [openCertificate, setOpenCertificate] = useState(false)
  const handleOpenCertificate = () => setOpenCertificate(true)
  const handleCloseCertificate = () => setOpenCertificate(false)

  const user = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userData')) : null

  const getAllEnrollmentCourse = () => {
    if (!user?.id) return

    const params = {
      studentID: user?.id
    }

    requestApiData
      .getEnrollCourse(params)
      .then(res => {
        if (res?.status === 200) {
          setStudentEnrollCourse(res?.data)
        }
      })
      .catch(err => {
        console.log('Error on Get Student Enroll Course', err)
      })
  }

  useEffect(() => {
    getAllEnrollmentCourse()
  }, [])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const nextLesson = (courseSlug, courseId, nextTask) => {
    dispatch({ type: 'SELECTED_LESSON', payload: nextTask })
    router.replace(`/courses/${courseSlug}/${courseId}`)
  }

  const nextTasks = []
  studentEnrollCourse &&
    studentEnrollCourse.map((item, i) => {
      if (item.totalTask > item.completeTask.length) {
        for (let i = 1; i <= item.totalTask; i++) {
          if (item.completeTask.indexOf(`item_${i}`) === -1) {
            const result = item?.course_modules
              .map(module => ({
                items: module.items.filter(item => item.navNo.includes(`item_${i}`))
              }))
              .filter(module => module.items.length > 0)

            nextTasks.push(result[0]?.items[0])

            break
          }
        }
      } else {
        nextTasks.push('')
      }
    })

  const [openongoingshare, setOpenongoingshare] = useState(false)

  const handleClickOpenongoingshare = () => {
    setOpenongoingshare(true)
  }

  const handleCloseongoingshare = () => {
    setOpenongoingshare(false)
    setAnchorE2(null)
  }

  const [openongoingunenroll, setOpenongoingunenroll] = useState(false)

  const handleClickOpenongoingunenroll = () => {
    setOpenongoingunenroll(true)
  }

  const handleCloseongoingunenroll = () => {
    setOpenongoingunenroll(false)
    setAnchorE2(null)
  }

  const handleongoingunenrollclass = item => {
    requestApiData.unenrollEnterprisecourse(item)
    getAllEnrollmentCourse()
    setOpenongoingunenroll(false)
  }

  const [opencompletedshare, setOpencompletedshare] = useState(false)

  const handleClickcompletedshare = () => {
    setOpencompletedshare(true)
  }

  const handleClosecompletedshare = () => {
    setOpencompletedshare(false)
    setAnchorE3(null)
  }

  const styling = {
    backgroundImage: `url('${imgConst.Certificate}')`,
    width: '100%',
    height: '600px',
    padding: '10px',
    textAlign: 'center',
    border: '10px solid #787878',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto'
  }

  const styling2 = {
    width: '910px',
    height: '560px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    border: '1px solid #787878'
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  function generateCertificate(item) {
    let doc = new jsPDF('landScape', 'px', 'a4', 'p', 'pt', 'letter', false)
    doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
    doc.addFont('Inter-Bold.ttf', 'Inter', 'bold')
    doc.setFont('Inter', 'bold')
    doc.setFontSize(30)
    doc.text('Congratulations!', 225, 60)
    doc.addImage(imgConst.logo_2, 'jpeg', 280, 120, 60, 0)
    doc.setFontSize(20)
    doc.setFont('Inter', 'bold')
    doc.text(`${user?.name}`, 250, 90)
    doc.setFontSize(16)
    doc.setFont('Inter', 'normal')
    doc.text('Successfully completed the course', 210, 220)
    doc.setFont('Inter', 'bold')
    doc.setFontSize(20)
    doc.text(`${item?.course_title}`, 280, 240)
    doc.setFont('Inter', 'normal')
    doc.setFontSize(16)
    doc.text(
      `${months[new Date(item?.completeDate).getMonth()]} ${new Date(item?.completeDate).getDate()}, ${new Date(
        item?.completeDate
      ).getFullYear()}`,
      270,
      280
    )
    doc.text(`completion ID : ${item?._id?.substr(item?._id?.length - 7)}`, 238, 300)
    doc.setFont('Inter', 'bold')
    doc.text(`Congratulations, you are now certified in ${item?.course_title}`, 170, 400)
    doc.setLineWidth(15)
    doc.setDrawColor(128, 128, 128)
    doc.line(0, 5, 700, 5)
    doc.line(5, 10, 5, 800)
    doc.line(800, 440, 0, 440)
    doc.line(625, 700, 625, 0)
    doc.setDrawColor(128, 128, 128)
    doc.setLineWidth(2)
    doc.line(21, 22, 611, 22)
    doc.line(22, 22, 22, 424)
    doc.line(611, 425, 21, 425)
    doc.line(610, 424, 610, 22)
    doc.save(item?._id?.substr(item?._id?.length - 7))
  }

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h5 className='text-black m-0'>My Courses</h5>
        <div className='d-flex align-items-center gap-4'>
          <Nav className='justify-content-end' tabs style={{ borderBottom: 'none' }}>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
                style={{ cursor: 'pointer', border: 'none', borderBottom: active === '1' ? '2px solid #4f46e5' : 'none', color: active === '1' ? '#4f46e5' : '#555', fontWeight: 600, backgroundColor: 'transparent' }}
              >
                In Progress
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2')
                }}
                style={{ cursor: 'pointer', border: 'none', borderBottom: active === '2' ? '2px solid #4f46e5' : 'none', color: active === '2' ? '#4f46e5' : '#555', fontWeight: 600, backgroundColor: 'transparent' }}
              >
                Completed
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>
      <TabContent className='py-2' activeTab={active}>
        <TabPane tabId='1'>
          {studentEnrollCourse &&
            studentEnrollCourse.map((item, i) =>
              item.status === 'Ongoing' ? (
                <div key={i} className='row learnningTimeBox justify-content-between align-items-center py-3 my-3' style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3 my-2  d-flex'>
                    <Avatar sx={{ bgcolor: '#4f46e5', mr: 2, width: 45, height: 45, fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {item.course_title?.charAt(0)?.toUpperCase() || 'C'}
                    </Avatar>
                    <div>
                      <h6 className='text-black'>{item.course_title}</h6>
                      <CardText style={{ fontSize: '12px' }} className='text-black'>
                        by {item.course_enterprise}
                      </CardText>
                    </div>
                  </div>

                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-5 d-flex '>
                    <Progress value={item.totalTask ? (item.completeTask.length / item.totalTask) * 100 : 0} />
                    <span className='ps-4 align-items-center text-black'>
                      {item.totalTask ? parseInt((item.completeTask.length / item.totalTask) * 100) + '%' : '0%'}
                    </span>
                  </div>
                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3'>
                    {nextTasks[i] ? (
                      <div className='text-black'>
                        Next up:
                        <CardText
                          className='cursor-pointer my-1 me-2'
                          onClick={() => nextLesson(item?.course_slug, item?.course_id, nextTasks[i])}
                        >
                          {nextTasks[i].name}
                        </CardText>
                      </div>
                    ) : item.totalTask === 0 ? (
                      <span style={{ fontWeight: 600, color: '#f39c12' }}>No content yet</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: '#4f46e5' }}>Start Course</span>
                    )}
                  </div>
                  <div className='col-1 ps-auto' style={{ float: 'right' }}>
                    <IconButton
                      id='basic-button'
                      aria-controls={openongoing ? 'basic-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={openongoing ? 'true' : undefined}
                      onClick={handleClickongoing}
                    >
                      <BsThreeDotsVertical size={32} />
                    </IconButton>
                    <Menu
                      id='basic-menu'
                      anchorEl={anchorE2}
                      open={openongoing}
                      onClose={handleCloseongoing}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                    >
                      <MenuItem className='drop-btn'>
                        <div className='drop-btn'>
                          <li variant='outlined' onClick={handleClickOpenongoingshare}>
                            Share
                          </li>
                          <BootstrapDialog
                            onClose={handleCloseongoingshare}
                            aria-labelledby='customized-dialog-title'
                            PaperProps={{
                              sx: {
                                width: '80%',
                                height: '30%',
                                backgroundColor: '#eae8fa',
                                borderRadius: '12px'
                              }
                            }}
                            open={openongoingshare}
                          >
                            <div className='p-3'>
                              <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseongoingshare} />

                              <DialogContent>
                                <div className='my-3'>
                                  <TwitterShareButton
                                    style={{ marginLeft: '20%', marginTop: '10%', color: 'black' }}
                                    url={`http://localhost:3001/Course-listing/`}
                                  >
                                    <FaTwitterSquare size={40} />
                                  </TwitterShareButton>
                                  <LinkedinShareButton
                                    style={{ marginLeft: '10%', color: 'black' }}
                                    url={`http://localhost:3001/Course-listing/`}
                                  >
                                    <FaLinkedin size={40} />
                                  </LinkedinShareButton>
                                  <InstapaperShareButton
                                    style={{ marginLeft: '10%', color: 'black' }}
                                    url={`http://localhost:3001/Course-listing/`}
                                  >
                                    <FaInstagram size={40} />
                                  </InstapaperShareButton>
                                  <FacebookShareButton
                                    style={{ marginLeft: '10%', color: 'black' }}
                                    url={`http://localhost:3001/Course-listing/`}
                                  >
                                    <FaFacebookSquare size={40} />
                                  </FacebookShareButton>
                                </div>
                              </DialogContent>
                            </div>
                          </BootstrapDialog>
                        </div>
                      </MenuItem>

                      <MenuItem className='drop-btn'>
                        <div>
                          <li variant='outlined' onClick={handleClickOpenongoingunenroll}>
                            Unenroll
                          </li>
                          <BootstrapDialog
                            onClose={handleCloseongoingunenroll}
                            aria-labelledby='customized-dialog-title'
                            open={openongoingunenroll}
                            PaperProps={{
                              sx: {
                                width: '80%',
                                height: '30%',
                                backgroundColor: '#eae8fa',
                                borderRadius: '12px'
                              }
                            }}
                          >
                            <div className='p-3'>
                              <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseongoingunenroll} />
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  flexDirection: 'column'
                                }}
                              >
                                <p className='my-3 text-black'>Are you sure you want to unenroll this class?</p>
                                <div className='d-flex my-5 '>
                                  <Button className='px-5  me-2' autoFocus onClick={handleCloseongoingunenroll}>
                                    Cancel
                                  </Button>
                                  <Button
                                    autoFocus
                                    className='px-5 me-2'
                                    onClick={() => handleongoingunenrollclass(item)}
                                  >
                                    Yes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </BootstrapDialog>
                        </div>
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              ) : (
                ''
              )
            )}
        </TabPane>
        <TabPane tabId='2'>
          {studentEnrollCourse &&
            studentEnrollCourse.map((item, i) =>
              item.status === 'Completed' ? (
                <div key={i} className='row learnningTimeBox justify-content-between align-items-center py-3 my-3' style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-2 my-2  d-flex'>
                    <Avatar sx={{ bgcolor: '#4f46e5', mr: 2, width: 45, height: 45, fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {item.course_title?.charAt(0)?.toUpperCase() || 'C'}
                    </Avatar>
                    <div>
                      <h6>{item.course_title}</h6>
                      <CardText style={{ fontSize: '12px' }}>by {item.course_enterprise}</CardText>
                    </div>
                  </div>

                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex'>
                    <Progress value={item.totalTask ? (item.completeTask.length / item.totalTask) * 100 : 0} />
                    <span className='ps-4 align-items-center'>
                      {item.totalTask ? parseInt((item.completeTask.length / item.totalTask) * 100) + '%' : '0%'}
                    </span>
                  </div>
                  <div className='col-sm-12 col-md-6 col-lg-6 col-xl-5'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <div>
                        Completed on : {item?.completeDate ? moment(item?.completeDate).format('DD/MM/YYYY') : ''}
                      </div>
                      <div>
                        <Button
                          variant='text'
                          onClick={() => {
                            handleOpenCertificate(), setCertificateID(item._id)
                          }}
                        >
                          View Certificate
                        </Button>
                      </div>

                      <div>
                        <IconButton
                          id='basic-button'
                          aria-controls={opencompleted ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={opencompleted ? 'true' : undefined}
                          onClick={handleClickcompleted}
                        >
                          <BsThreeDotsVertical size={32} />
                        </IconButton>
                        <Menu
                          id='basic-menu'
                          anchorEl={anchorE3}
                          open={opencompleted}
                          onClose={handleClosecompleted}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button'
                          }}
                        >
                          <MenuItem className='drop-btn'>
                            <div>
                              <li variant='outlined' onClick={handleClickcompletedshare}>
                                Share
                              </li>
                              <BootstrapDialog
                                onClose={handleClosecompletedshare}
                                aria-labelledby='customized-dialog-title'
                                PaperProps={{
                                  sx: {
                                    width: '60%',
                                    height: '30%'
                                  }
                                }}
                                open={opencompletedshare}
                              >
                                <div className='p-3'>
                                  <BootstrapDialogTitle
                                    id='customized-dialog-title'
                                    onClose={handleClosecompletedshare}
                                  />

                                  <DialogContent>
                                    <div className='my-3'>
                                      <TwitterShareButton
                                        style={{ marginLeft: '20%', marginTop: '10%' }}
                                        url={`http://localhost:3001/Course-listing/`}
                                      >
                                        <FaTwitterSquare size={40} />
                                      </TwitterShareButton>
                                      <LinkedinShareButton
                                        style={{ marginLeft: '10%' }}
                                        url={`http://localhost:3001/Course-listing/`}
                                      >
                                        <FaLinkedin size={40} />
                                      </LinkedinShareButton>
                                      <InstapaperShareButton
                                        style={{ marginLeft: '10%' }}
                                        url={`http://localhost:3001/Course-listing/`}
                                      >
                                        <FaInstagram size={40} />
                                      </InstapaperShareButton>
                                      <FacebookShareButton
                                        style={{ marginLeft: '10%' }}
                                        url={`http://localhost:3001/Course-listing/`}
                                      >
                                        <FaFacebookSquare size={40} />
                                      </FacebookShareButton>
                                    </div>
                                  </DialogContent>
                                </div>
                              </BootstrapDialog>
                            </div>
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )
            )}
        </TabPane>
      </TabContent>

      <BootstrapDialog
        onClose={handleCloseCertificate}
        aria-labelledby='customized-dialog-title'
        maxWidth='lg'
        PaperProps={{
          sx: {
            height: '75%'
          }
        }}
        open={openCertificate}
      >
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseCertificate} />

        {studentEnrollCourse.map(item =>
          item._id === certificateId ? (
            <DialogContent key={item._id}>
              <Box style={styling} id='htmlContent'>
                <Box style={styling2}>
                  <Box className='d-flex justify-content-between flex-column'>
                    <Box>
                      <Typography variant='h3' style={{ color: 'black', fontWeight: '700', marginTop: '15px' }}>
                        Congratulations!
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='h4' style={{ color: 'black', marginTop: '15px' }}>
                        {user?.name}
                      </Typography>
                      <img src={imgConst.logo_} height='70px' style={{ marginTop: '20px' }} />

                      <Typography variant='h5' style={{ marginTop: '20px', color: 'black' }}>
                        Successfully completed the course
                      </Typography>

                      <Typography variant='h4' style={{ color: 'black', fontWeight: '600', marginTop: '15px' }}>
                        {item?.course_title}
                      </Typography>
                      <Typography variant='h6' style={{ color: 'black', fontWeight: '700', marginTop: '15px' }}>
                        on {months[new Date(item?.completeDate).getMonth()]} {new Date(item?.completeDate).getDate()},
                        {new Date(item?.completeDate).getFullYear()}
                      </Typography>
                      <Typography variant='h6' style={{ color: 'black', fontWeight: '700', marginTop: '30px' }}>
                        {`completion ID : ${item?._id?.substr(item?._id?.length - 7)}`}
                      </Typography>
                      <Typography variant='h6' style={{ color: 'black', fontWeight: '700', marginTop: '30px' }}>
                        {`Congratulations, you are now certified in ${item?.course_title}`}
                      </Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ marginTop: '30px', textAlign: 'center' }}>
                <Button onClick={() => generateCertificate(item)} style={{ marginRight: '25px' }}>
                  Download
                </Button>
              </Box>
            </DialogContent>
          ) : (
            ''
          )
        )}
      </BootstrapDialog>
    </div>
  )
}

