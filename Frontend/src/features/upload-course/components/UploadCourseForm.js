// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Label, Button, CardBody, CardTitle, CardHeader } from 'reactstrap'

import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

//** API  */
import { useRouter } from 'next/router'
import Requests from 'src/configs/axiosRequest'
import toast from 'react-hot-toast'

export const UploadCourseForm = () => {
  const [courseData, setCourseData] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [category, setCategory] = useState([])
  const [course, setCourse] = useState([])

  // ** Hooks
  const router = useRouter()
  const requestApiData = new Requests()

  useEffect(() => {
    const url_str = window.location.href
    let url = new URL(url_str)
    let search_params = url.searchParams
    const updateId = search_params.get('id')

    if (updateId) {
      setCourseId(updateId)
      requestApiData
        .oneCourseRequest(updateId)
        .then(res => {
          if (res?.status === 200) setCourseData(res?.data)
        })
        .catch(err => console.log('oneCourseRequest in upload course', err))
    }
  }, [])

  useEffect(() => {
    requestApiData
      .getCategories()
      .then(res => {
        if (res?.status === 200) setCategory(res?.data)
      })
      .catch(err => console.log('getCategories', err))
  }, [])

  useEffect(() => {
    requestApiData
      .courseRequest()
      .then(res => {
        if (res?.status === 200) setCourse(res?.data)
      })
      .catch(err => console.log(err))
  }, [])

  const grid = 8

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#1F1F1F' : '#1F1F1F',
    ...draggableStyle
  })

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#414141' : '#414141',
    padding: grid,
    width: 'auto'
  })

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const onSubmit = async values => {
    await sleep(300)
    const createdBy = JSON.parse(localStorage.getItem('userData'))

    if (createdBy && values.title !== '') {
      if (courseId) {
        const payload = { ...values, createdBy: createdBy?.id, _id: courseId }
        requestApiData
          .updateCourseRequest(payload)
          .then(res => {
            if (res?.status === 200) {
              toast.success('You are Successfully upload course')
              router.push('/enterprise-courses')
            }
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
      } else {
        const payload = { ...values, createdBy: createdBy?.id }
        requestApiData
          .createCourseRequest(payload)
          .then(res => {
            if (res?.status === 200) {
              toast.success('You are Successfully upload course')
              router.push('/enterprise-courses')
            }
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
      }
    } else {
      toast.error('Title is Empty')
    }
  }

  const makeOnDragEndFunction = fields => result => {
    if (!result.destination) return
    fields.swap(result.source.index, result.destination.index)
  }

  let nextId = 1

  const initialValues = {
    thumbnail: courseData?.thumbnail ? courseData?.thumbnail : '',
    title: courseData?.title ? courseData?.title : '',
    description: courseData?.description ? courseData?.description : '',
    category: courseData?.category ? courseData?.category : '',
    requireCourse: courseData?.requireCourse ? courseData?.requireCourse : '',
    lessons: courseData?.lessons ? courseData?.lessons : '',
    lesson_type: 'add_lesson',
    status: 'draft'
  }

  return (
    <div className='profile-spacing'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({
          handleSubmit,
          form: { mutators: { push, pop } },
          pristine,
          form,
          submitting,
          values
        }) => (
          <form onSubmit={event => { handleSubmit(event).then(form.reset) }}>
            <Card className='border-0 p-4 profile-wrap'>
              <CardHeader>
                <CardTitle tag='h3'>Course</CardTitle>
              </CardHeader>
              <CardBody className='py-2 my-25'>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='title'>Title</Label>
                    <Field name='title' type='text' component='input' className='profile-input-box mb-1 form-control' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='description'>Description</Label>
                    <Field name='description' component='textarea' className='profile-input-box mb-1 form-control' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='file'>Thumbnail</Label>
                    <Field name='thumbnail' type='file' component='input' className='profile-input-box mb-1 form-control' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='Category'>Target Audience</Label>
                    <Field name='category' component='select' className='profile-input-box mb-1 form-control'>
                      <option />
                      <option value='Blockchain Developers'>Blockchain Developers</option>
                      <option value='Marketers'>Marketers</option>
                      <option value='Students'>Students</option>
                    </Field>
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='Category'>Category</Label>
                    <Field name='category' component='select' className='profile-input-box mb-1 form-control'>
                      <option />
                      {category.map((item, i) => (
                        <option key={i} value={item.name}>{item.name}</option>
                      ))}
                    </Field>
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='country'>Pre Required Course</Label>
                    <Field name='requireCourse' component='select' className='profile-input-box mb-1 form-control'>
                      <option />
                      {course.map((item, i) => (
                        <option key={i} value={item.title}>{item.title}</option>
                      ))}
                    </Field>
                  </Col>
                  <Col sm='12' className='mb-1 mt-3'>
                    <Label className='form-label me-4' for='country'>
                      <Field name='lesson_type' component='input' type='radio' value='add_lesson' className='me-1' />
                      Add Lesson
                    </Label>
                    <Label className='form-label' for='country'>
                      <Field name='lesson_type' component='input' type='radio' value='add_quiz' className='me-1' />
                      Add Quiz
                    </Label>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {values.lesson_type === 'add_quiz' ? (
              <Card className='border-0 p-4 profile-wrap mt-4'>
                <Row className='justify-content-between align-items-center'>
                  <Col md={6} className='mb-1'>
                    <CardHeader><CardTitle tag='h3'>Quiz</CardTitle></CardHeader>
                  </Col>
                  <Col md={6} className='mb-1 text-end'>
                    <Button type='button' className='me-2 px-5' color='primary' onClick={() => push('lessons', { id: nextId++ })}>
                      Add Quiz
                    </Button>
                  </Col>
                </Row>
                <CardBody className='py-2 my-25'>
                  <FieldArray name='lessons'>
                    {({ fields }) => (
                      <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
                        <Droppable droppableId='droppable'>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {fields.map((name, index) => (
                                <Draggable key={name} draggableId={name} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                      <Row className='justify-content-between align-items-center'>
                                        <Col md={12} className='mb-1'>
                                          <Field name={`${name}.id`}>
                                            {({ input: { name, value } }) => <label name={name}>Question. #{value}</label>}
                                          </Field>
                                        </Col>
                                        <Col md={12} className='mb-md-0 mb-1'>
                                          <Label className='form-label' for='Questions'>Questions</Label>
                                          <Field name={`${name}.questions`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={2} className='mb-md-0 mb-1 mt-3'>
                                          <Label className='form-label' for='A'>A</Label>
                                          <Field name={`${name}.A`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={2} className='mb-md-0 mb-1 mt-3'>
                                          <Label className='form-label' for='B'>B</Label>
                                          <Field name={`${name}.B`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={2} className='mb-md-0 mb-1 mt-3'>
                                          <Label className='form-label' for='C'>C</Label>
                                          <Field name={`${name}.C`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={2} className='mb-md-0 mb-1 mt-3'>
                                          <Label className='form-label' for='D'>D</Label>
                                          <Field name={`${name}.D`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col sm='6' className='mb-1 mt-3'>
                                          <Label className='form-label' for='answer'>Answer</Label>
                                          <Field name={`${name}.answer`} component='select' className='profile-input-box mb-1 form-control'>
                                            <option />
                                            <option value='A'>A</option>
                                            <option value='B'>B</option>
                                            <option value='C'>C</option>
                                            <option value='D'>D</option>
                                          </Field>
                                        </Col>
                                        <Col md={6} className='mb-md-0 mt-4 text-end'>
                                          <Button color='white' className='text-nowrap btn-danger px-3' onClick={() => fields.remove(index)} outline>
                                            <span>Delete</span>
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </FieldArray>
                </CardBody>
              </Card>
            ) : (
              <Card className='border-0 p-4 profile-wrap mt-4'>
                <Row className='justify-content-between align-items-center'>
                  <Col md={6} className='mb-1'>
                    <CardHeader><CardTitle tag='h3'>Lessons</CardTitle></CardHeader>
                  </Col>
                  <Col md={6} className='mb-1 text-end'>
                    <Button type='button' className='me-2 px-5' color='primary' onClick={() => push('lessons', { id: nextId++ })}>
                      Add Lesson
                    </Button>
                  </Col>
                </Row>
                <CardBody className='py-2 my-25'>
                  <FieldArray name='lessons'>
                    {({ fields }) => (
                      <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
                        <Droppable droppableId='droppable'>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {fields.map((name, index) => (
                                <Draggable key={name} draggableId={name} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                      <Row className='justify-content-between align-items-center'>
                                        <Col md={12} className='mb-1'>
                                          <Field name={`${name}.id`}>
                                            {({ input: { name, value } }) => <label name={name}>Lesson. #{value}</label>}
                                          </Field>
                                        </Col>
                                        <Col md={6} className='mb-1'>
                                          <Label className='form-label' for='title'>Title</Label>
                                          <Field name={`${name}.title`} type='text' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={6} className='mb-1'>
                                          <Label className='form-label' for='file'>File</Label>
                                          <Field name={`${name}.video`} type='file' component='input' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={6} className='mb-1'>
                                          <Label className='form-label' for='description'>Description</Label>
                                          <Field name={`${name}.description`} component='textarea' className='profile-input-box mb-1 form-control' />
                                        </Col>
                                        <Col md={6} className='mb-md-0 mt-4 text-end'>
                                          <Button color='white' className='text-nowrap btn-danger px-3' onClick={() => fields.remove(index)} outline>
                                            <span>Delete</span>
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </FieldArray>
                </CardBody>
              </Card>
            )}

            <Row className='justify-content-between align-items-center'>
              <Col sm='12' className='mb-1 mt-3'>
                <Label className='form-label me-4' for='status'>
                  <Field name='status' component='input' type='radio' value='draft' /> Draft
                </Label>
                <Label className='form-label' for='status'>
                  <Field name='status' component='input' type='radio' value='publish' /> Publish
                </Label>
              </Col>
              <Col sm='12' className='mb-1 mt-3'>
                <Button type='submit' className='me-2 px-5' color='primary' disabled={submitting || pristine}>
                  Save
                </Button>
                <Button type='button' className='me-2 px-5 text-end' color='primary' onClick={form.reset} disabled={submitting || pristine}>
                  Reset
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
    </div>
  )
}
