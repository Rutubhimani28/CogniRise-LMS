import React, { useEffect, useState } from 'react'
import { Label } from 'reactstrap'
import { DragDropContext as DragAndDrop } from 'react-beautiful-dnd'
import Drag from 'src/@core/components/drag-and-drop/Drag'
import Drop from 'src/@core/components/drag-and-drop/Drop'
import Reorder from 'src/@core/components/drag-and-drop/helpers'
import { RiArrowDropDownLine, RiDeleteBin6Line, RiEditFill } from 'react-icons/ri'
import Modal from '@mui/material/Modal'
import { Box, Button, IconButton, Tooltip } from '@mui/material'

import LessonModal from './LessonModal'
import { HiPlus } from 'react-icons/hi'
import QuizModal from './QuizModal'
import ModuleModal from './ModuleModal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '80%',
    md: 600
  },
  maxWidth: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 3,
    md: 4
  }
}

export const CourseBuilder = Props => {
  const [moduleToggle, setModuleToggle] = useState(0)
  const [moduleModal, setModuleModal] = useState(false)
  const [moduleIndex, setModuleIndex] = useState(null)
  const [moduleData, setModuleData] = useState(null)
  const [lessonModal, setLessonModal] = useState(false)
  const [lessonIndex, setLessonIndex] = useState(null)
  const [lessonData, setLessonData] = useState(null)
  const [quizModal, setQuizModal] = useState(false)
  const [quizIndex, setQuizIndex] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [lessonNo, setLessonNo] = useState(1)
  const [quizNo, setQuizNo] = useState(1)
  const [moduleArr, setModules] = useState([])

  const handleModuleOpen = index => {
    setModuleModal(true)
    if (index == 0 || index > 0) {
      setModuleIndex(index)
      setModuleData(moduleArr[index])
    }
  }

  const handleModuleClose = () => {
    setModuleIndex(null)
    setModuleData(null)
    setModuleModal(false)
  }

  const handleLessonOpen = (mIndex, index) => {
    setLessonModal(true)
    setModuleIndex(mIndex)
    if (index == 0 || index > 0) {
      setLessonIndex(index)
      setLessonData(moduleArr[mIndex].items[index].data)
    }
  }

  const handleLessonClose = () => {
    setModuleIndex(null)
    setLessonIndex(null)
    setLessonData(null)
    setLessonModal(false)
  }

  const handleQuizOpen = (mIndex, index) => {
    setQuizModal(true)
    setModuleIndex(mIndex)
    if (index == 0 || index > 0) {
      setQuizIndex(index)
      setQuizData(moduleArr[mIndex].items[index].data)
    }
  }

  const handleQuizClose = () => {
    setModuleIndex(null)
    setQuizIndex(null)
    setQuizData(null)
    setQuizModal(false)
  }

  useEffect(() => {
    if (Props.getData && Props.getData.length > 0 && moduleArr.length === 0) {
      setModules(Props.getData)
    }
  }, [Props.getData])

  useEffect(() => {
    Props.setData(moduleArr)
  }, [moduleArr])

  const handleDragEnd = result => {
    const { type, source, destination } = result

    if (!destination) return

    const sourceModuleId = source.droppableId
    const destinationModuleId = destination.droppableId

    if (type === 'droppable-item') {
      if (sourceModuleId === destinationModuleId) {
        const updatedOrder = Reorder(
          moduleArr.find(module => module.id === sourceModuleId).items,
          source.index,
          destination.index
        )

        const updatedModules = moduleArr.map(module =>
          module.id !== sourceModuleId ? module : { ...module, items: updatedOrder }
        )

        setModules(updatedModules)
      } else {
        const sourceOrder = moduleArr.find(module => module.id === sourceModuleId).items
        const destinationOrder = moduleArr.find(module => module.id === destinationModuleId).items

        const [removed] = sourceOrder.splice(source.index, 1)

        destinationOrder.splice(destination.index, 0, removed)
        destinationOrder[removed] = sourceOrder[removed]
        delete sourceOrder[removed]

        const updatedModules = moduleArr.map(module =>
          module.id === sourceModuleId
            ? { ...module, items: sourceOrder }
            : module.id === destinationModuleId
              ? { ...module, items: destinationOrder }
              : module
        )

        setModules(updatedModules)
      }
    }

    if (type === 'droppable-module') {
      const updatedModules = Reorder(moduleArr, source.index, destination.index)
      setModules(updatedModules)
    }
  }

  const handleModuleSave = moduleTitle => {
    setModuleModal(false)
    if (moduleArr.length > 0 && (moduleIndex == 0 || moduleIndex > 0)) {
      const updatedModules = [...moduleArr]
      updatedModules[moduleIndex].name = moduleTitle
      setModules(updatedModules)
      setModuleIndex(null)
      setModuleData(null)
    } else {
      setModules([
        ...moduleArr,
        {
          id: `Module_${moduleArr.length + 1}`,
          name: moduleTitle,
          items: []
        }
      ])
    }
  }

  const handleLessonSave = lessonData => {
    setLessonModal(false)
    const defaultCat = moduleArr
    setModules(
      defaultCat.map((val, index) => {
        if (index == moduleIndex) {
          if (lessonIndex == 0 || lessonIndex > 0) {
            const defaultItem = [...(val.items || [])]
            defaultItem[lessonIndex] = { ...defaultItem[lessonIndex], name: lessonData.name, data: lessonData }
            setModuleIndex(null)
            setLessonIndex(null)
            setLessonData(null)

            return { ...val, items: defaultItem }
          } else {
            const defaultItem = [...(val.items || [])]
            defaultItem.push({ id: `lesson_${defaultItem.length + 1}`, name: lessonData.name, data: lessonData })
            setModuleIndex(null)
            setLessonIndex(null)
            setLessonData(null)
            setLessonNo(lessonNo + 1)

            return { ...val, items: defaultItem }
          }
        } else {
          return val
        }
      })
    )
  }

  const handleQuizSave = quizData => {
    setQuizModal(false)
    const defaultCat = moduleArr
    setModules(
      defaultCat.map((val, index) => {
        if (index == moduleIndex) {
          if (quizIndex == 0 || quizIndex > 0) {
            const defaultItem = [...(val.items || [])]
            defaultItem[quizIndex] = { ...defaultItem[quizIndex], name: quizData.name, data: quizData }
            setModuleIndex(null)
            setQuizIndex(null)
            setQuizData(null)

            return { ...val, items: defaultItem }
          } else {
            const defaultItem = [...(val.items || [])]
            defaultItem.push({ id: `quiz_${defaultItem.length + 1}`, name: quizData.name, data: quizData })
            setModuleIndex(null)
            setQuizIndex(null)
            setQuizData(null)
            setQuizNo(quizNo + 1)

            return { ...val, items: defaultItem }
          }
        } else {
          return val
        }
      })
    )
  }

  const deleteModule = mIndex => {
    setModules(moduleArr.filter((moduleArr, index) => index != mIndex))
  }

  const deleteModuleItem = (mIndex, index) => {
    setModules(
      moduleArr.map((module, mapIndex) => {
        if (mapIndex == mIndex) {
          return { ...module, items: module.items.filter((item, ind) => ind != index) }
        }

        return { ...module }
      })
    )
  }

  return (
    <div>
      <div className='border-0  mt-4 '>
        <DragAndDrop onDragEnd={handleDragEnd}>
          <Drop id='droppable' type='droppable-module'>
            {moduleArr.map((module, mIndex) => {
              return (
                <Drag
                  className='draggable-module'
                  key={module.id}
                  id={module.id}
                  index={mIndex}
                  style={{ backgroundColor: 'white', color: 'black' }}
                >
                  <div className='module-container'>
                    <div className='item d-flex justify-content-between align-items-center'>
                      <Label className='form-label fs-6 mb-0' for='title'>
                        Module: {module.name}
                      </Label>

                      <div>
                        <Tooltip title="Edit Module" placement="top" arrow>
                          <IconButton onClick={() => handleModuleOpen(mIndex)} sx={{ color: '#7d9b17', bgcolor: 'rgba(125, 155, 23, 0.1)', '&:hover': { bgcolor: 'rgba(125, 155, 23, 0.2)' }, mr: 1, borderRadius: 1 }}>
                            <RiEditFill size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Module" placement="top" arrow>
                          <IconButton onClick={() => deleteModule(mIndex)} sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' }, mr: 1, borderRadius: 1 }}>
                            <RiDeleteBin6Line size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={moduleToggle === mIndex ? "Collapse Items" : "Expand Items"} placement="top" arrow>
                          <IconButton onClick={() => setModuleToggle(moduleToggle === mIndex ? null : mIndex)} sx={{ color: '#3A5BCD', bgcolor: 'rgba(58, 91, 205, 0.1)', '&:hover': { bgcolor: 'rgba(58, 91, 205, 0.2)' }, borderRadius: 1 }}>
                            <RiArrowDropDownLine size={24} style={{ transform: moduleToggle === mIndex ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    {moduleToggle === mIndex && (
                      <Drop
                        id={module.id}
                        type='droppable-item'
                        style={{ backgroundColor: 'white', borderRadius: '10px' }}
                      >
                        {(module.items || []).map((item, index) => {
                          return (
                            <React.Fragment key={item.id}>
                              <Drag className='draggable' id={item.id} index={index}>
                                <div className='item2 d-flex justify-content-between align-items-center'>
                                  <Label className='form-label fs-6 mb-0' for='title'>
                                    {item?.id?.split('_')[0] === 'lesson' ? 'Lesson: ' : 'Quiz: '} {item.name}
                                  </Label>
                                  <div>
                                    <Tooltip title={`Edit ${item?.id?.split('_')[0] === 'lesson' ? 'Lesson' : 'Quiz'}`} placement="top" arrow>
                                      <IconButton
                                        onClick={() =>
                                          item?.id.split('_', 1) == 'lesson'
                                            ? handleLessonOpen(mIndex, index)
                                            : handleQuizOpen(mIndex, index)
                                        }
                                        sx={{ color: '#7d9b17', bgcolor: 'rgba(125, 155, 23, 0.1)', '&:hover': { bgcolor: 'rgba(125, 155, 23, 0.2)' }, mr: 1, borderRadius: 1 }}
                                      >
                                        <RiEditFill size={20} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Delete ${item?.id?.split('_')[0] === 'lesson' ? 'Lesson' : 'Quiz'}`} placement="top" arrow>
                                      <IconButton
                                        onClick={() => deleteModuleItem(mIndex, index)}
                                        sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' }, borderRadius: 1 }}
                                      >
                                        <RiDeleteBin6Line size={20} />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                              </Drag>
                            </React.Fragment>
                          )
                        })}
                        <div
                          className='d-flex pb-4 pt-2 ms-3'
                          style={{ backgroundColor: 'white', borderRadius: '10px', maxWidth: '80%' }}
                        >
                          <Button
                            variant='outlined'
                            onClick={() => handleLessonOpen(mIndex)}
                            sx={{ mr: 2, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}
                            startIcon={<HiPlus />}
                          >
                            Add Lesson
                          </Button>
                          <Button
                            variant='outlined'
                            onClick={() => handleQuizOpen(mIndex)}
                            sx={{ mr: 2, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}
                            startIcon={<HiPlus />}
                          >
                            Add Quiz
                          </Button>
                        </div>
                      </Drop>
                    )}
                  </div>
                </Drag>
              )
            })}
          </Drop>
        </DragAndDrop>
        <Button
          type='button'
          variant='contained'
          onClick={() => setModuleModal(true)}
          sx={{
            mt: 3,
            bgcolor: '#7d9b17',
            color: 'white',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { bgcolor: '#4338ca' }
          }}
          startIcon={<HiPlus />}
        >
          Add Module
        </Button>
      </div>

      <Modal
        open={lessonModal}
        onClose={handleLessonClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{ overflowY: 'auto', borderRadius: '10px' }}
      >
        <Box sx={style}>
          <LessonModal lessonClose={handleLessonClose} lessonSave={handleLessonSave} lessonData={lessonData} />
        </Box>
      </Modal>

      <Modal
        open={quizModal}
        onClose={handleQuizClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{ overflowY: 'auto' }}
      >
        <Box sx={style}>
          <QuizModal quizClose={handleQuizClose} quizSave={handleQuizSave} quizData={quizData} />
        </Box>
      </Modal>

      <Modal
        open={moduleModal}
        onClose={handleModuleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='modal-border'
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'red'
            }
          },
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 4]
                }
              }
            ]
          }
        }}
      >
        <Box sx={style}>
          <ModuleModal moduleClose={handleModuleClose} moduleSave={handleModuleSave} moduleData={moduleData} />
        </Box>
      </Modal>
    </div>
  )
}

export default CourseBuilder

