import React, { useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'

import imgConst from 'src/configs/imgConst'

import { FaTelegramPlane, FaTwitter, FaInstagram, FaLinkedinIn, FaDiscord } from 'react-icons/fa'
import BeforeLoginHeader from 'src/views/pages/components/BeforeLoginHeader'
import { Box, Grid, Typography, Container, Button } from '@mui/material'

export const LandingPageView = () => {
  const [open, setOpen] = useState('1')

  const acoToggle = id => {
    if (open === id) {
      setOpen()
    } else {
      setOpen(id)
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  const features = [
    { img: imgConst.f1, label: 'Community' },
    { img: imgConst.f5, label: 'Build Dapps' },
    { img: imgConst.f9, label: 'Infrastructure Research' },
    { img: imgConst.f2, label: 'NFT Minting' },
    { img: imgConst.f6, label: 'Corporate Partnerships' },
    { img: imgConst.f10, label: 'Grow Your Reputation' },
    { img: imgConst.f3, label: 'Freelance' },
    { img: imgConst.f7, label: 'Sharing Economy' },
    { img: imgConst.f11, label: 'Community Economy' },
    { img: imgConst.f4, label: 'Open Source' },
    { img: imgConst.f8, label: 'Volunteer Projects' },
    { img: imgConst.f12, label: 'Developers Community' }
  ]

  return (
    <div style={{ backgroundColor: '#0D0128 !important' }}>
      <BeforeLoginHeader />
      <Container>
        <div className='flex items-center'>
          <div className='text-center text-white'>
            <div className='my-44'>
              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold addHeadingColor bannerHeading1'>
                SkillDevelop
              </h1>
              <h6 className='text-xl font-bold mt-lg-4 mt-sm-0 banner-small-text  word-break text-wrap px-lg-0 px-sm-5'>
                The Education Protocol for the Blockchain
              </h6>
            </div>
          </div>
        </div>

        <Box sx={{ px: 2, py: 4 }}>
          <Grid container spacing={4} alignItems='center' className='collageDaoAboutWrap'>
            <Grid item xs={12} lg={6}>
              <Box className='' />
              <Box>
                <img
                  src={imgConst.about1}
                  alt='About Visual'
                  width={'100%'}
                />
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Typography variant='h4' className='display-6 fw-bolder aboutTitle' gutterBottom>
                How generations will learn moving forward
              </Typography>

              <Typography variant='body1' className='aboutcontentPara text-black' paragraph>
                Blockchain education is fragmented. This makes it difficult for newcomers and old timers alike who have
                to navigate to multiple places to access resources, find meet-ups, join a team or host an event.
              </Typography>

              <Typography variant='body1' className='aboutcontentPara text-black'>
                Our Mission is to be the hub of Web3 education, collaboration and innovation on college campuses
                worldwide.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 2, py: 4 }}>
          <Grid container spacing={4} alignItems='center' className='collageDaoAboutWrap'>
            <Grid item xs={12} lg={6}>
              <Box className='' />
              <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'black' }}>
                Our Why
              </Typography>
              <Typography variant='h4' className='aboutTitle mb-2 shipping-main-heading'>
                The vision for Web3 is being curated here
              </Typography>
              <Typography variant='body1' className='whyUs'>
                Creating opportunities for innovation, collaboration, and real-world impact.
              </Typography>
            </Grid>

            <Grid item xs={12} lg={6} className='blockChainRightContent'>
              <Box>
                <img
                  src={imgConst.why}
                  alt='Blockchain Visual'
                  style={{
                    width: '100%',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ color: '#FFFFFF', px: 2 }}>
          <Box className='ecoHeading'>
            <Grid container spacing={4}>
              <Grid item xs={12} xl={6}>
                <Box display='flex' alignItems='center'>
                  <Typography
                    className='fw-semibold smallColor addHeadingColor'
                    sx={{ fontSize: '2rem', color: 'black' }}
                  >
                    CollegeDAO
                  </Typography>
                  <Typography
                    className='EcosystemHeading2 smallColor ps-2 fw-semibold addHeadingColor'
                    sx={{ fontSize: '2rem' }}
                  >
                    Ecosystem
                  </Typography>
                </Box>

                <Typography
                  variant='body1'
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textAlign: { xs: 'center', sm: 'left' },
                    whiteSpace: 'normal',
                    lineHeight: 1.4,
                    mb: 3,
                    color: 'black'
                  }}
                >
                  Our infrastructure is under development to be the best in class nexus for blockchain education
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} lg={6}>
                    <Box display='flex' alignItems='center' py={2}>
                      <Box component='span' className='me-1 ecoleftIcon '>
                        <img
                          src={imgConst.eco1}
                          alt='Education Icon'
                          style={{
                            filter:
                              'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                          }}
                        />
                      </Box>
                      <Typography variant='h6' className='ecoleftSmallHeading text-black'>
                        Education
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Box display='flex' alignItems='center' py={{ xs: 0, lg: 2 }}>
                      <Box component='span' className='me-1 ecoleftIcon'>
                        <img
                          src={imgConst.eco4}
                          alt='Community Icon'
                          style={{
                            filter:
                              'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                          }}
                        />
                      </Box>
                      <Typography variant='h6' className='ecoleftSmallHeading text-black'>
                        Community
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} xl={6} className='ecoRightBox'>
                <Grid container>
                  <Grid item xs={12} sm={6} lg={4} className='ecoRightBoxContent' sx={{ p: 0 }}>
                    <Typography variant='h6' className='ecoRightbobBorder ecoRightBoxHeading addHeadingColor'>
                      Academy
                    </Typography>
                    <Typography className='ecoRightbobBorder text-black'>Top Companies</Typography>
                    <Typography className='ecoRightbobBorder text-black'>Specialized Tracks</Typography>
                    <Typography className='ecoRightbobBorder text-black' sx={{ borderBottom: 0 }}>
                      Basic to Advanced
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={4} className='ecoRightBoxContent' sx={{ p: 0 }}>
                    <Typography variant='h6' className='ecoRightbobBorder ecoRightBoxHeading addHeadingColor'>
                      Web3 Careers
                    </Typography>
                    <Typography className='ecoRightbobBorder text-black'>Internship Network</Typography>
                    <Typography className='ecoRightbobBorder text-black'>Full-time offers</Typography>
                    <Typography className='ecoRightbobBorder text-black' sx={{ borderBottom: 0 }}>
                      Networking Events
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={4} className='ecoRightBoxContent' sx={{ p: 0 }}>
                    <Typography
                      variant='h6'
                      className='ecoRightbobBorder ecoRightBoxHeading addHeadingColor'
                      sx={{ borderRight: 0 }}
                    >
                      Student Startups
                    </Typography>
                    <Typography className='ecoRightbobBorder text-black' sx={{ borderRight: 0 }}>
                      Investor Network
                    </Typography>
                    <Typography className='ecoRightbobBorder text-black' sx={{ borderRight: 0 }}>
                      Advisors and Mentors
                    </Typography>
                    <Typography className='ecoRightbobBorder text-black' sx={{ borderBottom: 0, borderRight: 0 }}>
                      Community Ownership
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ color: '#FFFFFF', textAlign: 'center', px: 2, py: 4 }}>
          <Box className='shappingHeadwrap'>
            <Typography variant='h4' className='shapingHeading addHeadingColor'>
              Everything blockchain, in one place,
              <br /> on strong foundations
            </Typography>
          </Box>

          <Box className='shappingWrap' mt={4}>
            <Grid container spacing={4} justifyContent='center'>
              <Grid item xs={12} md={6} xl={4} className='zIndexbox shappingSpace'>
                <Box className='shapingBox'>
                  <Box className='shapinImgRound'>
                    <img
                      src={imgConst.icon1}
                      alt='Blockchain Projects'
                      style={{
                        filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                      }}
                    />
                  </Box>
                  <Typography variant='h6' className='shapingBoxHeading text-black'>
                    BLOCKCHAIN PROJECTS
                  </Typography>
                  <Typography className='shapingBoxContent text-black'>
                    Tired of hiking gas fees, and spending tons of money on development to extend limited functionality?
                  </Typography>
                  <Button className='joinBtn'>JOIN OUR ECOSYSTEM</Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6} xl={4} className='zIndexbox shappingSpace'>
                <Box className='shapingBox'>
                  <Box className='shapinImgRound'>
                    <img
                      src={imgConst.icon2}
                      alt='App Developers'
                      style={{
                        filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                      }}
                    />
                  </Box>

                  <Typography variant='h6' className='shapingBoxHeading  text-black'>
                    APP DEVELOPERS
                  </Typography>
                  <Typography className='shapingBoxContent text-black'>
                    Too much complexity to manage deployments, permissions, external storage, and DIY integration?
                  </Typography>
                  <Button className='joinBtn'>JOIN OUR ECOSYSTEM</Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6} xl={4} className='zIndexbox shappingSpace'>
                <Box className='shapingBox'>
                  <Box className='shapinImgRound'>
                    <img
                      src={imgConst.icon3}
                      alt='Everyone'
                      style={{
                        filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                      }}
                    />
                  </Box>
                  <Typography variant='h6' className='shapingBoxHeading text-black'>
                    EVERYONE
                  </Typography>
                  <Typography className='shapingBoxContent text-black'>
                    Experiencing high gas fees, slow wait time, and difficult usability for even the simplest
                    transactions?
                  </Typography>
                  <Button className='joinBtn'>JOIN OUR ECOSYSTEM</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Grid container justifyContent='center' spacing={4} className='findPlaceWrap'>
          <Grid item xs={12} md={4}>
            <Box className='text-left md:pl-4'>
              <Typography variant='h4' className='aboutTitle comman-heading addHeadingColor'>
                Backed by the best
              </Typography>
              <Typography variant='h6' className='findPlaceSubHeading mt-4'>
                In the near future, anyone, anywhere, can thrive in the decentralized economy
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3} textAlign={'center'} display={'flex'} justifyContent={'center'}>
              {features.map((item, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} display={'flex'} justifyContent={'center'}>
                  <Box className='findPlaceBox flex items-center p-4 bg-gray-800 rounded-md shadow-md hover:shadow-lg transition'>
                    <img
                      src={item.img}
                      alt={item.label}
                      className='mr-3 w-6 h-6 '
                      style={{
                        filter: 'invert(26%) sepia(90%) saturate(2340%) hue-rotate(233deg) brightness(96%) contrast(93%)'
                      }}
                    />
                    <Typography variant='h6' className='text-black ps-1'>
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <div className='container faq-container mt-2' style={{ textAlign: 'center' }}>
          <div className='row AccodianWrap m-0'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-3 me-4'>
              <h3 className='QuesHeading shipping-main-heading addHeadingColor'>Frequenly Asked Questions</h3>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 faq-accordion-wrapper'>
              <Accordion open={open} toggle={acoToggle} className='custom-accordion'>
                <AccordionItem className='custom-accordion-item'>
                  <AccordionHeader className='custom-accordion-header !text-black' targetId='1'>
                    Is Eduvanza open to everybody and anybody?
                  </AccordionHeader>
                  <AccordionBody accordionId='1' className='text-left'>
                    Yes, we are an open, no-stakes and low-commitment community, which means anybody can join in on our
                    journey and contribute in their respective capacities.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem className='custom-accordion-item'>
                  <AccordionHeader className='custom-accordion-header' targetId='2'>
                    Do I have to pay for access to Eduvanza’s Academy?
                  </AccordionHeader>
                  <AccordionBody accordionId='2'>
                    Yes, we are an open, no-stakes and low-commitment community, which means anybody can join in on our
                    journey and contribute in their respective capacities.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem className='custom-accordion-item'>
                  <AccordionHeader className='custom-accordion-header' targetId='3'>
                    How do I apply for a Web3 job?
                  </AccordionHeader>
                  <AccordionBody accordionId='3'>
                    Yes, we are an open, no-stakes and low-commitment community, which means anybody can join in on our
                    journey and contribute in their respective capacities.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem className='custom-accordion-item'>
                  <AccordionHeader className='custom-accordion-header' targetId='4'>
                    Can I be a part of a student organization and Eduvanza?
                  </AccordionHeader>
                  <AccordionBody accordionId='4'>
                    Yes, we are an open, no-stakes and low-commitment community, which means anybody can join in on our
                    journey and contribute in their respective capacities.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem className='custom-accordion-item'>
                  <AccordionHeader className='custom-accordion-header' targetId='5'>
                    How do I start something on my campus?
                  </AccordionHeader>
                  <AccordionBody accordionId='5'>
                    Yes, we are an open, no-stakes and low-commitment community, which means anybody can join in on our
                    journey and contribute in their respective capacities.
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className='mx-lg-1 mb-3 mx-sm-5'>
          <h6 className='text-base font-bold py-3 banner-small-heading text-center md:text-left'>Partnered with</h6>
          <Box className='marquee-container mt-4 overflow-hidden'>
            <Box className='marquee flex items-center'>
              {[
                { logo: imgConst.logo1, name: 'Eduvanza' },
                { logo: imgConst.logo2, name: 'Chainlink' },
                { logo: imgConst.logo3, name: 'TATUM' },
                { logo: imgConst.logo4, name: 'METAMASK' },
                { logo: imgConst.logo1, name: 'Eduvanza' },
                { logo: imgConst.logo5, name: 'TREEHOUSE' },
                { logo: imgConst.logo1, name: 'Eduvanza' },
                { logo: imgConst.logo3, name: 'TATUM' },
                { logo: imgConst.logo4, name: 'METAMASK' },
                { logo: imgConst.logo1, name: 'Eduvanza' }
              ].map((partner, index) => (
                <img
                  key={index}
                  src={partner.logo}
                  alt={partner.name}
                  style={{
                    width: '180px',
                    height: '120px',
                    objectFit: 'contain',
                    flexShrink: 0,
                    marginRight: '30px'
                  }}
                />
              ))}
            </Box>
          </Box>
        </div>
      </Container>
      <div className='footer-bg text-light py-4 '>
        <div className='container-fluid row footerSection m-0'>
          <div className='col-12 col-xl-5  text-center text-xl-start mb-3 '>
            <div className='mb-3 text-black'></div>
            <p className='text-black '>
              Eduvanza is the first and largest student-led community bringing blockchain education and opportunities
              to college campuses worldwide
            </p>
          </div>

          <div className='col-12 col-xl-7'>
            <div className='row text-center text-md-start' style={{ fontFamily: "'Nunito', sans-serif" }}>
              <div className='col-12 col-sm-6 col-lg-4 mb-3'>
                <h5 className='addHeadingColor'>Academy</h5>
                <h6 className='pt-3 text-black'>Top Companies</h6>
                <h6 className='pt-2 text-black'>Specialized Tracks</h6>
              </div>
              <div className='col-12 col-sm-6 col-lg-4 mb-3'>
                <h5 className='addHeadingColor'>Web3 Careers</h5>
                <h6 className='pt-3 text-black'>Internship Network</h6>
                <h6 className='pt-2 text-black'>Full-time offers</h6>
              </div>
              <div className='col-12 col-sm-6 col-lg-4 mb-3'>
                <h5 className='addHeadingColor'>Student Startups</h5>
                <h6 className='pt-3 text-black'>Investor Network</h6>
                <h6 className='pt-2 text-black'>Advisors and Mentors</h6>
              </div>
            </div>
          </div>
        </div>

        <hr className='container my-3' />

        <div className='container'>
          <div className='row flex-column flex-md-row justify-content-between align-items-center text-center text-md-start'>
            <div className='col-12 col-md-auto mb-3 mb-md-0 order-1 order-md-0'>
              <p className='mb-0 text-black'>&copy; 2022, Eduvanza</p>
            </div>

            <div className='col-12 col-md-auto order-0 order-md-1 mb-3 mb-md-0'>
              <div className='d-flex justify-content-center justify-content-md-end gap-3 flex-wrap'>
                <FaTelegramPlane className='socialIcon' />
                <FaTwitter className='socialIcon' />
                <FaDiscord className='socialIcon' />
                <FaInstagram className='socialIcon' />
                <FaLinkedinIn className='socialIcon' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
