import { Fragment, useState, useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'
import { Row, Col } from 'reactstrap'
import { Box, Grid, Typography, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import imgConst from 'src/configs/imgConst'
import { FaTwitter } from 'react-icons/fa'
import { GrLinkedin } from 'react-icons/gr'
import { VscGlobe } from 'react-icons/vsc'

export const ViewStudentProfile = () => {
  const requestApiData = new Requests()
  const router = useRouter()
  const [getData, setGetData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return

    const params = {
      'profile.profileSlug': router?.query?.profileSlug
    }

    setLoading(true)
    requestApiData.getUser(params).then(res => {
      if (res?.status === 200) {
        setGetData(res.data[0])
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [router.isReady])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#7d9b17' }} />
      </Box>
    )
  }

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Box className='text-center '>
            {getData?.profile?.profileImg ? (
              <img
                className='rounded-circle'
                src={getData?.profile?.profileImg}
                alt='Upload Profile Image'
                height='148'
                width='148'
              />
            ) : (
              <img src={imgConst.avtar} width={'120px'} />
            )}
            <Typography className='mb-3 mt-3 fs-4' color='white'>
              {getData?.profile?.name}
            </Typography>
            <Typography className='mb-2' color='white'>
              Student at university of Michigan in {getData?.profile?.university}
            </Typography>
            <Typography className='mb-2' color='white'>
              {getData?.profile?.expLevel} Years Experience
            </Typography>
            <Typography className='mb-2' color='white'>
              {getData?.profile?.major} Major
            </Typography>
            <Typography className='mb-2' color='white'>
              {getData?.profile?.minor} Minor
            </Typography>
            <Typography className='mb-2' color='white'>
              {getData?.profile?.email}
            </Typography>
            <Typography className='mb-2 ' color='#0d6efd'>
              https://collegedao.io/person/{getData?.profile?.profileSlug}
            </Typography>
            <Typography className='mb-5' color='white'>
              {' '}
              Interests {getData?.profile?.interests}
            </Typography>
            <Grid display='flex' justifyContent='center'>
              <GrLinkedin className='student-icon' color='#207ecf' fontSize='25px' />
              <FaTwitter className='student-icon ' color='#00c4ff' fontSize='30px' />
              <VscGlobe className='student-icon' color='white' fontSize='30px' />
            </Grid>
          </Box>
        </Col>
      </Row>
    </Fragment>
  )
}

