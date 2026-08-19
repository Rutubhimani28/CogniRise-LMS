import { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import * as yup from 'yup'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Requests from 'src/configs/axiosRequest'
import { useSelector } from 'react-redux'

// ** Icon Imports
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

export default function QuizContent({ courseName, instructor, lesson, data }) {
  // For show quiz result modal
  const [showResult, setShowResult] = useState(false)
  const [resultMessage, setResultMessage] = useState('')

  const requestApiData = new Requests()
  const [user, setUser] = useState(null)
  const courseId = useSelector(state => state?.course?.courseId)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(JSON.parse(window.localStorage.getItem('userData')))
    }
  }, [])

  // For show quiz result modal
  const modalShowResultClose = () => {
    setShowResult(false)
  }

  let initVal = {}
  let schemaVal = {}
  data?.questionItems &&
    data.questionItems.map((question, i) => {
      initVal[question?.id] = ''
      schemaVal[question?.id] = yup.string().required('Required')
    })

  const quizSchema = yup.object(schemaVal)

  return (
    <>
      {data ? (
        <div
          className='course-wrap'
          style={{
            padding: { xs: '0.75rem', sm: '12px', md: '1.5rem' },
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '#636363 0px 2px 8px 0px'
          }}
        >
          <Grid container direction='column' spacing={2} sx={{ width: '100%' }}>
            <Grid item>
              <Typography
                variant='h6'
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  margin: 0,
                  width: '100%'
                }}
                className='mt-2 addHeadingColor'
              >
                {data.name}
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                variant='body2'
                sx={{
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  color: 'black',
                  textAlign: 'left',
                  textAlign: { xs: 'center', sm: 'left' },
                  margin: 0,
                  width: '100%'
                }}
              >
                {courseName} : Lesson {lesson}
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                component='h6'
                className='video-small-heading text-black'
                sx={{
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  marginBottom: '1.5rem'
                }}
              >
                Powered By: <span className='color-change ps-2'>{instructor}</span>
              </Typography>
            </Grid>

            <Formik
              initialValues={initVal}
              validationSchema={quizSchema}
              onSubmit={values => {
                let totalQuestion = 0
                let rightAns = 0

                data?.questionItems &&
                  data.questionItems.map((question, i) => {
                    ++totalQuestion
                    if (values[question?.id] === question?.ans) {
                      ++rightAns
                    }
                  })

                setResultMessage(`Your score is ${rightAns} out of ${totalQuestion}`)
                setShowResult(true)
                if (user?.role === 'student') {
                  const params1 = {
                    studentID: user?.id,
                    courseID: courseId
                  }
                  requestApiData
                    .getAllEnrollment(params1)
                    .then(res => {
                      if (res?.status === 200) {
                        const completeLesson = `item_${lesson.split('/', 1)}`

                        if ((res?.data[0]?.completeTask).indexOf(completeLesson) === -1) {
                          let params = {}
                          if ((res?.data[0]?.completeTask).length + 1 === res?.data[0]?.totalTask) {
                            params = {
                              studentID: user?.id,
                              courseID: courseId,
                              completeTask: [...res?.data[0]?.completeTask, completeLesson],
                              completeTaskDuration: res?.data[0]?.completeTaskDuration,
                              status: 'Completed',
                              completeDate: Date.now()
                            }
                          } else {
                            params = {
                              studentID: user?.id,
                              courseID: courseId,
                              completeTask: [...res?.data[0]?.completeTask, completeLesson],
                              completeTaskDuration: res?.data[0]?.completeTaskDuration
                            }
                          }
                          requestApiData
                            .updateCompleteTask(params)
                            .then(res => {
                              if (res?.status === 200) {
                                console.log('Success', res?.data)
                              }
                            })
                            .catch(err => {
                              console.log('Error on set enrolment complete task', err)
                            })
                        } else {
                          console.log('22222222222222222222')
                        }
                      }
                    })
                    .catch(err => {
                      console.log('Error on Get enrollment data', err)
                    })
                }
              }}
            >
              {({ values }) => (
                <Form>
                  {data?.questionItems &&
                    data.questionItems.map((question, mindex) => (
                      <div key={mindex} style={{ marginBottom: '1.5rem' }}>
                        <div
                          id='question-name'
                          style={{
                            fontSize: { xs: '0.9375rem', sm: '1rem' },
                            fontWeight: 500,
                            marginBottom: '0.75rem',
                            color: 'black'
                          }}
                        >
                          {question?.name}
                        </div>
                        <div role='group' aria-labelledby='my-radio-group'>
                          {question?.options &&
                            question.options.map((option, index) => (
                              <div
                                style={{
                                  marginBottom: '0.5rem',
                                  marginLeft: '0.5rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                key={index}
                              >
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Field
                                    type='radio'
                                    name={question?.id}
                                    value={option?.name}
                                    style={{
                                      marginRight: '0.5rem',
                                      width: '1rem',
                                      height: '1rem'
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                      color: 'black'
                                    }}
                                  >
                                    {option?.name}
                                  </span>
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  <button
                    className='beforeLoginbtn p-2'
                    type='submit'
                    style={{
                      padding: { xs: '0.5rem 1rem', sm: '0.625rem 1.25rem' },
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      marginTop: '1rem'
                    }}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </Grid>

          {/* For show quiz result modal */}
          <Modal
            open={showResult}
            onClose={modalShowResultClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <IconButton
                size='small'
                onClick={() => modalShowResultClose()}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='tabler:x' />
              </IconButton>
              <Typography id='modal-modal-title' variant='h6' component='h2' className='addHeadingColor'>
                Your Quiz Result
              </Typography>
              <Typography id='modal-modal-description' sx={{ mt: 2, color: 'black' }}>
                {resultMessage}
              </Typography>
            </Box>
          </Modal>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
