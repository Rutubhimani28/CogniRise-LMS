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

  const validData = data ? data.filter(module => module?.name || (module?.items && module.items.length > 0)) : []

  return (
    <div
      style={{
        width: '100%',
        height: 'fit-content'
      }}
    >
      <Box
        sx={{
          px: { xs: 0, sm: 2 },
          py: 2,
          height: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box flexDirection={'column'}>
          <h5 className='video-small-heading addHeadingColor' style={{ fontSize: '1rem', color: '#7d9b17' }}>
            Course content
          </h5>
        </Box>
        {validData.length === 0 ? (
          <Typography sx={{ color: '#6c757d', fontSize: '0.9rem', mt: 2, textAlign: 'center', pb: 2 }}>
            No modules available
          </Typography>
        ) : (
          validData.map((module, mindex) => (
            <div key={mindex}>
              <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }}>
                <AccordionSummary
                  id={`panel-header-${mindex}`}
                  aria-controls={`panel-content-${mindex}`}
                  expandIcon={<Icon color='black' fontSize='1.25rem' icon='tabler:chevron-down' />}
                  sx={{ px: 0, minHeight: '48px', '&.Mui-expanded': { minHeight: '48px' } }}
                >
                  <Typography className='text-black' sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 500 }}>
                    {module?.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, py: 1 }}>
                  {module?.items &&
                    module.items.map((item, index) => {
                      return (
                        <Typography
                          className='py-1'
                          onClick={() => dispatch({ type: 'SELECTED_LESSON', payload: item })}
                          sx={{
                            color: '#6c757d',
                            cursor: 'pointer',
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            '&:hover': { color: '#7d9b17' }
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
          ))
        )}
      </Box>
    </div>
  )
}

