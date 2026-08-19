import React from 'react'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'

export default function CourseContent({ data }) {
  const dispatch = useDispatch()

  return (
    <div
      style={{
        width: '100%',
        height: 'fit-content'
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: 2,
          height: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box flexDirection={'column'}>
          <h5 className='video-small-heading addHeadingColor' style={{ fontSize: '1rem', color: '#7d9b17' }}>
            Course content
          </h5>
        </Box>
        {data &&
          data.map((module, mindex) => (
            <div key={mindex}>
              <Accordion>
                <AccordionSummary
                  id={`panel-header-${mindex}`}
                  aria-controls={`panel-content-${mindex}`}
                  expandIcon={<Icon color='black' fontSize='1.25rem' icon='tabler:chevron-down' />}
                >
                  <Typography className='text-black' sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {module?.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {module?.items &&
                    module.items.map((item, index) => {
                      return (
                        <Typography
                          className='py-2'
                          onClick={() => dispatch({ type: 'SELECTED_LESSON', payload: item })}
                          sx={{
                            color: 'black',
                            cursor: 'pointer',
                            fontSize: { xs: '0.85rem', sm: '0.9rem' }
                          }}
                          key={index}
                        >
                          {item?.name}
                        </Typography>
                      )
                    })}
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </Box>
    </div>
  )
}

