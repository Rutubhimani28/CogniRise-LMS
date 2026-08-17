import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import InputPasswordToggle from 'src/@core/components/input-password-toggle/index'
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { Dialog, DialogContent, MenuItem, Select } from '@mui/material'

import imgConst from 'src/configs/imgConst'

import { useFormik } from 'formik'
import Requests from 'src/configs/axiosRequest'
import { registerSchema1, registerSchema2 } from '../schemas/registerSchema'

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export const RegisterForm = () => {
  const requestApiData = new Requests()

  const [allCategory, setAllCategory] = useState([])
  const [show1, setShow1] = useState(true)
  const [show, setShow] = useState(false)
  const [formValue, setFormValue] = useState([])

  useEffect(() => {
    requestApiData
      .getCategories()
      .then(res => {
        setAllCategory(res.data)
      })
      .catch(err => {
        console.log('Get all categories', err)
      })
  }, [])

  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const { settings } = useSettings()

  const { skin } = settings

  const handleBack = () => {
    setShow1(true)
    setShow(false)
  }

  const formik1 = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    enableReinitialize: true,
    validationSchema: registerSchema1,
    onSubmit: values => {
      setFormValue(values)
      setShow(true)
      setShow1(false)
    }
  })

  const formik2 = useFormik({
    initialValues: {
      profile: {
        name: '',
        graduation: '',
        profileSlug: '',
        major: '',
        minor: '',
        university: '',
        location: '',
        interests: '',
        expLevel: '',
        twitter: '',
        linkedin: ''
      }
    },
    enableReinitialize: true,
    validationSchema: registerSchema2,
    onSubmit: values => {
      const payload = {
        ...formValue,
        role: 'student',
        profile: {
          name: values?.name,
          graduation: values?.graduation,
          profileSlug: values?.profileSlug,
          major: values?.major,
          minor: values?.minor,
          university: values?.university,
          location: values?.location,
          interests: values?.interests,
          expLevel: values?.expLevel,
          twitter: values?.twitter,
          linkedin: values?.linkedin
        }
      }
      router.push('/profile/student')
      auth.register(payload)
    }
  })

  return (
    <div className='login-page ragister-page' style={{ backgroundColor: 'white' }}>
      <Dialog
        fullWidth
        open={show1}
        maxWidth='sm'
        scroll='body'
        onClose={handleBack}
        sx={{ backgroundColor: 'white' }}
        BackdropProps={{
          style: { backgroundColor: 'white' }
        }}
        PaperProps={{
          style: {
            backgroundColor: 'white !important',
            borderRadius: '12px'
          }
        }}
      >
        <DialogContent
          sx={{
            position: 'relative',
            backgroundColor: 'white',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(7)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='d-flex justify-content-center align-items-center'>
            <Box className='login-wrap layout-ragister'>
              <div className='box-border'></div>

              <RightWrapper>
                <Box
                  sx={{
                    p: [6, 12],
                    height: '100%',
                    display: 'flex',
                    color: 'black',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Box
                      sx={{ pb: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                    >
                      <img
                        src={imgConst.mainLogo}
                        alt='logo'
                        width={'80px'}
                        height={'80px'}
                        style={{ display: 'block', margin: '0 auto' }}
                      />
                    </Box>
                    <Box>
                      <Form className='auth-register-form ' onSubmit={formik1.handleSubmit}>
                        <div className='mb-3'>
                          <Label className='form-label text-black' for='register-email'>
                            Email<span className='text-danger'> * </span>
                          </Label>
                          <Input
                            name='email'
                            type='email'
                            id='register-email'
                            placeholder='john@example.edu'
                            value={formik1.values.email}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            invalid={formik1.errors.email && formik1.touched.email == true}
                          />
                          {formik1.errors.email && formik1.touched.email == true ? (
                            <FormFeedback>{formik1.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-3'>
                          <Label className='form-label text-black' for='register-password'>
                            Password<span className='text-danger'> * </span>
                          </Label>
                          <InputPasswordToggle
                            name='password'
                            className='input-group-merge'
                            id='register-password'
                            value={formik1.values.password}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            invalid={formik1.errors.password && formik1.touched.password == true}
                          />
                          {formik1.errors.password && formik1.touched.password == true ? (
                            <FormFeedback>{formik1.errors.password}</FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-4'>
                          <Label className='form-label text-black' for='register-password'>
                            Confirm Password<span className='text-danger'> * </span>
                          </Label>
                          <InputPasswordToggle
                            name='confirmPassword'
                            className='input-group-merge'
                            id='register-confirmpassword'
                            value={formik1.values.confirmPassword}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            invalid={formik1.errors.confirmPassword && formik1.touched.confirmPassword == true}
                          />
                          {formik1.errors.confirmPassword && formik1.touched.confirmPassword == true ? (
                            <FormFeedback>{formik1.errors.confirmPassword}</FormFeedback>
                          ) : null}
                        </div>
                        <Button className='mb-4 ragisterBtn' type='submit' block>
                          Next
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Typography className='text-black ' sx={{ mr: 2 }}>
                            If you already have an account?
                          </Typography>
                          <Typography variant='body2'>
                            <LinkStyled href='/login' className='text-black' sx={{ fontSize: '1rem' }}>
                              Sign In
                            </LinkStyled>
                          </Typography>
                        </Box>
                      </Form>
                    </Box>
                  </Box>
                </Box>
              </RightWrapper>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={() => setShow(true)}
        BackdropProps={{
          style: { backgroundColor: 'white' }
        }}
        PaperProps={{
          style: {
            backgroundColor: 'white',
            borderRadius: '12px'
          }
        }}
      >
        <DialogContent
          sx={{
            position: 'relative',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Card className='border-0  profile-wrap layout-ragister'>
              <div className='profile-heading'>
                <CardTitle tag='h4' className='text-black'>
                  Profile Details
                </CardTitle>
              </div>
              <CardBody>
                <Form className='mt-4 pt-50' onSubmit={formik2.handleSubmit}>
                  <Row>
                    <Col sm='12' className='mb-1 '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Name
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='name'
                            type='text'
                            value={formik2.values.name || ''}
                            onChange={formik2.handleChange}
                            onBlur={formik2.handleBlur}
                            invalid={formik2.errors.name && true}
                          />
                          {formik2.errors.name ? <FormFeedback>{formik2.errors.name}</FormFeedback> : null}
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1  '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Graduation
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='graduation'
                            type='text'
                            value={formik2.values.graduation || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4 '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Profile Slug
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='profileSlug'
                            type='text'
                            value={formik2.values.profileSlug || ''}
                            onChange={formik2.handleChange}
                          />
                          <Typography className='text-black'>
                            Profile Link: https://collegedao.io/person/{formik2.values.profileSlug}
                          </Typography>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1  '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Major
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='major'
                            type='text'
                            value={formik2.values.major || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1  '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Minor
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='minor'
                            type='text'
                            value={formik2.values.minor || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1  '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            University
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='university'
                            type='text'
                            value={formik2.values.university || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1 '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Location
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='location'
                            type='text'
                            value={formik2.values.location || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4 d-flex'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black me-5' for='studentName'>
                            Interests
                          </Label>
                        </Col>
                        <Col sm='9'>
                          {/* <FormControl fullWidth size='small'> */}
                          <FormControl className='search-text' fullWidth>
                            <Select
                              name='interests'
                              className='custom-select text-black'
                              fullWidth
                              value={formik2.values.interests || ''}
                              onChange={formik2.handleChange}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                              sx={{
                                border: '1px solid black',
                                color: 'black',
                                backgroundColor: 'white',
                                '.MuiSelect-icon': {
                                  color: 'black'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'white'
                                }
                              }}
                            >
                              {allCategory &&
                                allCategory.map((item, index) => (
                                  <MenuItem key={index} value={item.name} className='text-black'>
                                    {item.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1 '>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Experience Level
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='expLevel'
                            type='text'
                            value={formik2.values.expLevel || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <CardHeader className='profile-heading mb-2 mt-4' style={{ backgroundColor: 'none' }}>
                      <CardTitle tag='h4' className='text-black'>
                        Social accounts
                      </CardTitle>
                    </CardHeader>
                    <Col md='12'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            Twitter
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box '
                            name='twitter'
                            type='text'
                            value={formik2.values.twitter || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col md='12'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label text-black' for='studentName'>
                            LinkedIn
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='linkedin'
                            type='text'
                            value={formik2.values.linkedin || ''}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md='12'>
                      <Button className='mt-5 beforeLoginbtn' onClick={handleBack}>
                        Back
                      </Button>
                      <Button type='submit' className='ms-2 mt-5 beforeLoginbtn'>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}
