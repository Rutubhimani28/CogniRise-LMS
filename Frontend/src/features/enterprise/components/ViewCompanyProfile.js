import { Fragment, useState, useEffect } from 'react'
import Requests from 'src/configs/axiosRequest'
import { Row, Col } from 'reactstrap'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import imgConst from 'src/configs/imgConst'
import { FaTwitter } from 'react-icons/fa'
import { GrLinkedin } from 'react-icons/gr'
import { VscGlobe } from 'react-icons/vsc'
import Link from 'next/link'

export const ViewCompanyProfile = () => {
  const requestApiData = new Requests()
  const router = useRouter()

  const [getData, setGetData] = useState(null)

  useEffect(() => {
    if (!router.isReady) return

    const params = {
      'profile.companySlug': router?.query?.companySlug
    }

    requestApiData.getUser(params).then(res => {
      if (res?.status === 200) {
        setGetData(res.data[0])
      }
    })
  }, [router.isReady])

  return getData ? (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Box className='text-center'>
            <Grid container spacing={2} alignItems='start'>
              <Grid item xs={12} md={3} display='flex' justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <img
                  src={getData?.profile?.profileImg || imgConst?.avtar}
                  alt='Profile Image'
                  className='rounded-circle'
                  style={{
                    width: '100%',
                    maxWidth: '148px',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </Grid>

              <Grid item xs={12} md={9} className='text-start ps-md-5 mt-3 mt-md-0'>
                <Typography className='mb-3 addHeadingColor' fontSize='22px'>
                  {getData?.profile?.name}
                </Typography>
                <Typography className='mb-1 text-black'>{getData?.email}</Typography>
                <Typography className='mb-5 text-black'>{getData?.profile?.employeeSize} Employees</Typography>

                <Typography className='mb-2 mt-4 text-black' fontSize='22px'>
                  Description
                </Typography>
                <Typography className='mb-5 text-black' fontSize='14px'>
                  {getData?.profile?.description}
                </Typography>

                <Typography className='mb-1 text-black'>
                  Industry Verticales: <span>{getData?.profile?.industryVerticale}</span>
                </Typography>
                <Typography className='mb-1 text-black'>{getData?.profile?.companyType}</Typography>
                <Typography className='mb-5 text-black'>
                  Founded: <span>{getData?.profile?.foundingDate}</span>
                </Typography>

                {/* Social Icons */}
                <Grid display='flex' gap={2}>
                  {getData?.profile?.twitter && (
                    <Link href={getData?.profile?.twitter} target='_blank' rel='noopener noreferrer'>
                      <FaTwitter color='#00c4ff' fontSize='30px' />
                    </Link>
                  )}
                  {getData?.profile?.linkedin && (
                    <Link href={getData?.profile?.linkedin} target='_blank' rel='noopener noreferrer'>
                      <GrLinkedin color='#207ecf' fontSize='25px' />
                    </Link>
                  )}
                  {getData?.profile?.website && (
                    <Link href={getData?.profile?.website} target='_blank' rel='noopener noreferrer'>
                      <VscGlobe className='text-dark' fontSize='30px' />
                    </Link>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Col>
      </Row>
    </Fragment>
  ) : null
}
