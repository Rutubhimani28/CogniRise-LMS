import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

import InputPasswordToggle from 'src/@core/components/input-password-toggle/index'

import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { Dialog, DialogContent, MenuItem, Select } from '@mui/material'

import imgConst from 'src/configs/imgConst'

import * as yup from 'yup'
import { useFormik } from 'formik'
import Requests from 'src/configs/axiosRequest'

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

export const EnterpriseRegisterForm = () => {
  const requestApiData = new Requests()

  const [allCategory, setAllCategory] = useState([])
  const [show1, setShow1] = useState(true)
  const [show, setShow] = useState(false)
  const [formValue, setFormValue] = useState([])

  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const { settings } = useSettings()

  const { skin } = settings

  const handleBack = () => {
    setShow1(true)
    setShow(false)
  }

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

  const validationSchema1 = yup.object({
    email: yup.string().required('Email is required').email('Enter a valid email'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Password does not match')
  })

  const validationSchema2 = yup.object({
    name: yup.string().required('Enterprise name is required')
  })

  const formik1 = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema1,
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
        companySlug: '',
        employeeSize: '',
        industryVerticale: '',
        companyType: '',
        foundingDate: '',
        description: '',
        twitter: '',
        linkedin: '',
        website: ''
      }
    },
    enableReinitialize: true,
    validationSchema: validationSchema2,
    onSubmit: values => {
      const payload = {
        ...formValue,
        role: 'enterprise',
        profile: {
          name: values?.name,
          companySlug: values?.companySlug,
          employeeSize: values?.employeeSize,
          industryVerticale: values?.industryVerticale,
          companyType: values?.companyType,
          foundingDate: values?.foundingDate,
          description: values?.description,
          twitter: values?.twitter,
          linkedin: values?.linkedin,
          website: values?.website
        }
      }
      router.push('/profile/student')
      auth.register(payload)
    }
  })

  return (
    <div className='login-page'>
      <Dialog fullWidth open={show1} maxWidth='sm' scroll='body'>
        <DialogContent
          sx={{
            position: 'relative',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(7)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box>
            <Box sx={{ backgroundColor: 'background.paper' }}>
              <div className='box-border'></div>

              <RightWrapper>
                <Box
                  sx={{
                    p: [6, 12],
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Box sx={{ pb: 10 }}>
                      <img src={imgConst.logo} width={'180px'} />
                    </Box>

                    <Form className='auth-register-form ' onSubmit={formik1.handleSubmit}>
                      <div className='mb-3'>
                        <Label className='form-label' htmlFor='register-email'>
                          Email<span className='text-white'> * </span>
                        </Label>
                        <Input
                          name='email'
                          type='email'
                          id='register-email'
                          placeholder='john@example.com'
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
                        <Label className='form-label' htmlFor='register-password'>
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
                        <Label className='form-label' htmlFor='register-password'>
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
                      <Button className='mb-4' type='submit' color='primary' block>
                        Next
                      </Button>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography sx={{ color: 'text.secondary', mr: 2 }}>If you already have an account?</Typography>
                        <Typography variant='body2'>
                          <LinkStyled href='/login' sx={{ fontSize: '1rem' }}>
                            Sign In
                          </LinkStyled>
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.disabled',
                          '& .MuiDivider-wrapper': { px: 6 },
                          my: theme => `${theme.spacing(6)} !important`
                        }}
                      >
                        or
                      </Divider>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          href='/'
                          component={Link}
                          sx={{ color: '#497ce2' }}
                          onClick={e => e.preventDefault()}
                        >
                          <Icon icon='mdi:facebook' />
                        </IconButton>
                        <IconButton
                          href='/'
                          component={Link}
                          sx={{ color: '#1da1f2' }}
                          onClick={e => e.preventDefault()}
                        >
                          <Icon icon='mdi:twitter' />
                        </IconButton>
                        <IconButton
                          href='/'
                          component={Link}
                          onClick={e => e.preventDefault()}
                          sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                        >
                          <Icon icon='mdi:github' />
                        </IconButton>
                        <IconButton
                          href='/'
                          component={Link}
                          sx={{ color: '#db4437' }}
                          onClick={e => e.preventDefault()}
                        >
                          <Icon icon='mdi:google' />
                        </IconButton>
                      </Box>
                    </Form>
                  </Box>
                </Box>
              </RightWrapper>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog fullWidth open={show} maxWidth='sm' scroll='body' onClickAway={() => setShow(true)}>
        <DialogContent
          sx={{
            position: 'relative',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Card className='border-0  profile-wrap'>
              <CardHeader className='profile-heading'>
                <CardTitle tag='h4'>Profile Details</CardTitle>
              </CardHeader>
              <CardBody>
                <Form className='mt-4 pt-50' onSubmit={formik2.handleSubmit}>
                  <Row>
                    <Col sm='12' className='mb-1'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Company Name
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='name'
                            type='text'
                            value={formik2.values.name}
                            onChange={formik2.handleChange}
                            onBlur={formik2.handleBlur}
                            invalid={formik2.errors.name && true}
                          />
                          {formik2.errors.name ? <FormFeedback>{formik2.errors.name}</FormFeedback> : null}
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Company Slug
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='companySlug'
                            type='text'
                            value={formik2.values.companySlug}
                            onChange={formik2.handleChange}
                          />
                          <Typography>
                            Profile Link: https://collegedao.io/company/{formik2.values.companySlug}
                          </Typography>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='employeeSize'>
                            Employee size
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <FormControl fullWidth className='search-text'>
                            <Select
                              value={formik2.values.employeeSize}
                              onChange={formik2.handleChange}
                              name='employeeSize'
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value='1-10'>1-10</MenuItem>
                              <MenuItem value='11-50'>11-50</MenuItem>
                              <MenuItem value='51-1000'>51-1000</MenuItem>
                              <MenuItem value='1000+'>1000+</MenuItem>
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='country'>
                            Industry Verticale
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <FormControl fullWidth className='search-text'>
                            <Select
                              name='industryVerticale'
                              value={formik2.values.industryVerticale}
                              onChange={formik2.handleChange}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              {allCategory &&
                                allCategory.map((item, index) => (
                                  <MenuItem key={index} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-4'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='country'>
                            Company Type
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <FormControl fullWidth className='search-text'>
                            <Select
                              value={formik2.values.companyType}
                              onChange={formik2.handleChange}
                              name='companyType'
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value='Profit'>Profit</MenuItem>
                              <MenuItem value='Non-Profit'>Non-Profit</MenuItem>
                              <MenuItem value='Blockchain Ecosystem'>Blockchain Ecosystem</MenuItem>
                              <MenuItem value='DAO'>DAO</MenuItem>
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Founding Date
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            type='date'
                            name='foundingDate'
                            value={formik2.values.foundingDate}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1'>
                      <div className='pt-5'>
                        <Label className='form-label pb-2' htmlFor='bio'>
                          Company Description
                        </Label>
                      </div>
                      <div className='pb-5'>
                        <Input
                          className='profile-input-box'
                          name='description'
                          type='textarea'
                          rows='4'
                          cols='6'
                          value={formik2?.values?.description}
                          onChange={formik2.handleChange}
                        />
                      </div>
                    </Col>
                    <Col sm='12' className='mb-1'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Twitter
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='twitter'
                            type='text'
                            value={formik2.values.twitter}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Linkedin
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='linkedin'
                            type='text'
                            value={formik2.values.linkedin}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm='12' className='mb-1'>
                      <Row>
                        <Col sm='3'>
                          <Label className='form-label' htmlFor='student-name'>
                            Website
                          </Label>
                        </Col>
                        <Col sm='9'>
                          <Input
                            className='profile-input-box'
                            name='website'
                            type='text'
                            value={formik2.values.website}
                            onChange={formik2.handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col md='12'>
                      <Button className='mt-5' color='primary' onClick={handleBack}>
                        Back
                      </Button>
                      <Button type='submit' className='ms-2 mt-5' color='primary'>
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
