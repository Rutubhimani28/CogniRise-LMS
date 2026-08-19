import React, { useEffect, useState } from 'react'
import { Label } from 'reactstrap'
import { DragDropContext as DragAndDrop } from 'react-beautiful-dnd'
import Drag from 'src/@core/components/drag-and-drop/Drag'
import Drop from 'src/@core/components/drag-and-drop/Drop'
import Reorder from 'src/@core/components/drag-and-drop/helpers'
import { RiArrowDropDownLine, RiDeleteBin6Line, RiEditFill } from 'react-icons/ri'
import Modal from '@mui/material/Modal'
import { FormControl, MenuItem, Select, Typography, Box, TextField, Button, IconButton, Tooltip, Radio } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import QuestionModal from './QuestionModal'
import OptionModal from './OptionModal'
import { HiPlus } from 'react-icons/hi'
import { FaPlus } from 'react-icons/fa'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: 600 },
  bgcolor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }
}

export default function QuizModal({ quizClose, quizSave, quizData }) {
  const [questionToggle, setQuestionToggle] = useState(0)
  const [quizName, setQuizName] = useState(quizData?.name || '')
  const [files, setFiles] = useState([])
  const [previewImage, setPreviewImage] = useState(null)

  const [questionModal, setQuestionModal] = useState(false)
  const [questionIndex, setQuestionsIndex] = useState(null)
  const [questionData, setQuestionData] = useState(null)

  const [optionModal, setOptionModal] = useState(false)
  const [optionIndex, setOptionIndex] = useState(null)
  const [optionData, setOptionData] = useState(null)

  const [questionArr, setQuestions] = useState(quizData?.questionItems || [])

  useEffect(() => {
    if (quizData?.file) {
      if (typeof quizData.file === 'string') {
        setPreviewImage(quizData.file)
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(quizData.file)
      }
    }
  }, [quizData])

  const handleQuestionOpen = index => {
    setQuestionModal(true)
    if (index >= 0) {
      setQuestionsIndex(index)
      setQuestionData(questionArr[index])
    }
  }

  const handleQuestionClose = () => {
    setQuestionsIndex(null)
    setQuestionData(null)
    setQuestionModal(false)
  }

  const handleOptionOpen = (qIndex, index) => {
    setOptionModal(true)
    setQuestionsIndex(qIndex)
    if (index >= 0) {
      setOptionIndex(index)
      setOptionData(questionArr[qIndex].options[index].name)
    }
  }

  const handleOptionClose = () => {
    setQuestionsIndex(null)
    setOptionIndex(null)
    setOptionData(null)
    setOptionModal(false)
  }

  const handleQuizSubmit = e => {
    e.preventDefault()

    const QuizData = {
      name: quizName,
      questionItems: questionArr,
      file: files.length > 0 ? files[0] : previewImage
    }
    quizSave(QuizData)
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = () => {
          setFiles([file])
          setPreviewImage(reader.result)
        }

        reader.readAsDataURL(file)
      }
    }
  })

  const renderImagePreview = () => {
    if (!previewImage) {
      return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
          <FaPlus className='add-buttone text-white' fontSize={30} />
          <span className='text-black'>Choose a file or drag and drop it here</span>
        </Box>
      )
    }

    return (
      <img
        className='single-file-image'
        src={previewImage}
        width='100px'
        height='100px'
        alt='Preview'
        onError={e => {
          e.target.onerror = null
          e.target.src = ''
          setPreviewImage(null)
        }}
      />
    )
  }

  const handleQuestionFormat = (Val, QIndex) => {
    if (questionArr.length > 0 && QIndex >= 0) {
      const updatedQuestions = [...questionArr]
      updatedQuestions[QIndex].format = Val
      setQuestions(updatedQuestions)
    }
  }

  const handleDragEnd = result => {
    const { type, source, destination } = result
    if (!destination) return

    if (type === 'droppable-question') {
      const updatedQuestions = Reorder(questionArr, source.index, destination.index)
      setQuestions(updatedQuestions)
    }
  }

  const handleQuestionSave = questionTitle => {
    setQuestionModal(false)
    if (questionArr.length > 0 && (questionIndex == 0 || questionIndex > 0)) {
      const updatedQuestions = [...questionArr]
      updatedQuestions[questionIndex].name = questionTitle
      setQuestions(updatedQuestions)
    } else {
      setQuestions([
        ...questionArr,
        {
          id: `question_${questionArr.length + 1}`,
          name: questionTitle,
          format: 'MCQ',
          options: []
        }
      ])
    }
    setQuestionsIndex(null)
    setQuestionData(null)
  }

  const handleOptionSave = optionTitle => {
    setOptionModal(false)
    const updatedQuestions = [...questionArr]

    if (optionIndex !== null && optionIndex >= 0) {
      updatedQuestions[questionIndex].options[optionIndex].name = optionTitle
    } else {
      updatedQuestions[questionIndex].options.push({
        id: `option_${updatedQuestions[questionIndex].options.length + 1}`,
        name: optionTitle
      })
    }

    setQuestions(updatedQuestions)
    setQuestionsIndex(null)
    setOptionIndex(null)
    setOptionData(null)
  }

  const onChangeOptionVal = (QIndex, optIndex, value) => {
    const updatedQuestions = [...questionArr]
    updatedQuestions[QIndex].options[optIndex].name = value
    setQuestions(updatedQuestions)
  }

  const saveAnswerVal = (qIndex, optIndex, value) => {
    if (value) {
      const updatedQuestions = [...questionArr]
      updatedQuestions[qIndex].ans = updatedQuestions[qIndex].options[optIndex].name
      setQuestions(updatedQuestions)
    }
  }

  const deleteQuestion = qIndex => {
    setQuestions(questionArr.filter((_, index) => index !== qIndex))
  }

  return (
    <div>
      <>
        <Typography id='modal-modal-title' className='fs-3 pb-3 addHeadingColor'>
          Edit Quiz: Let's Get Started
        </Typography>
        <TextField
          fullWidth
          label='Title'
          name='name'
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
          placeholder='Enter Quiz Title'
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
        />
        <Box
          {...getRootProps({ className: 'dropzone' })}
          sx={previewImage ? { height: 150 } : {}}
          style={{ border: '2px dashed #414141', borderRadius: '5px', padding: '30px' }}
        >
          <input {...getInputProps()} />
          {renderImagePreview()}
        </Box>
        <Typography variant='body2' sx={{ mb: 2.5 }} className='text-black py-2'>
          File types supported: JPG, PNG. Max Size: 5 MB
        </Typography>
        <Label className='form-label pt-3 text-black' for='firstName'>
          Tasks
        </Label>
        <div className='border-0 mt-4'>
          <DragAndDrop onDragEnd={handleDragEnd}>
            <Drop id='droppable' type='droppable-question'>
              {questionArr.map((question, qIndex) => (
                <Drag className='draggable-question' key={question.id} id={question.id} index={qIndex}>
                  <div className='question-container'>
                    <div className='item d-flex justify-content-between align-items-center'>
                      <Label className='form-label fs-6 mb-0' for='title'>
                        {question.name}
                      </Label>
                      <div>
                        <Tooltip title="Edit Question" placement="top" arrow>
                          <IconButton onClick={() => handleQuestionOpen(qIndex)} sx={{ color: '#7d9b17', bgcolor: 'rgba(125, 155, 23, 0.1)', '&:hover': { bgcolor: 'rgba(125, 155, 23, 0.2)' }, mr: 1, borderRadius: 1 }}>
                            <RiEditFill size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Question" placement="top" arrow>
                          <IconButton onClick={() => deleteQuestion(qIndex)} sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' }, mr: 1, borderRadius: 1 }}>
                            <RiDeleteBin6Line size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={questionToggle === qIndex ? "Collapse Options" : "Expand Options"} placement="top" arrow>
                          <IconButton onClick={() => setQuestionToggle(questionToggle === qIndex ? null : qIndex)} sx={{ color: '#3A5BCD', bgcolor: 'rgba(58, 91, 205, 0.1)', '&:hover': { bgcolor: 'rgba(58, 91, 205, 0.2)' }, borderRadius: 1 }}>
                            <RiArrowDropDownLine size={24} style={{ transform: questionToggle === qIndex ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    {questionToggle === qIndex && (
                      <Drop id={question.id} type='droppable-item'>
                        <div className='d-flex align-items-center'>
                          <Label className='form-label pt-3 pe-4 fs-6'>Format</Label>
                          <FormControl sx={{ m: 1, minWidth: 250 }} className='que-Select'>
                            <Select
                              size='small'
                              value={question.format}
                              onChange={e => handleQuestionFormat(e.target.value, qIndex)}
                              sx={{
                                color: 'black',
                                borderRadius: '8px',
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7d9b17', borderWidth: '2px' }
                              }}
                            >
                              <MenuItem value='MCQ' className='text-black'>
                                Multiple Choice question
                              </MenuItem>
                              <MenuItem value='Custom' className='text-black'>
                                Custom (E.g. Check Smart Contract)
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Label className='form-label mt-1 ps-2 pe-4 fs-6'>Answer</Label>
                        </div>
                        {question.format === 'MCQ' && (
                          <div className='pt-2' id='dropdown-section'>
                            <div className='d-flex'>
                              <div className='d-flex justify-content-between align-items-start'>
                                <Label className='form-label pe-4 pt-2' for='firstName'>
                                  Options
                                </Label>
                                <div className='d-flex justify-content-between align-items-center flex-column'>
                                  {question.options.map((item, index) => (
                                    <div className='d-flex justify-content-between align-items-center' key={index}>
                                      <div className='d-flex align-items-center justify-content-between'>
                                        <TextField
                                          fullWidth
                                          size='small'
                                          value={item.name}
                                          onChange={e => onChangeOptionVal(qIndex, index, e.target.value)}
                                          sx={{ mr: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
                                        />
                                        <Radio
                                          checked={question.ans === item.name}
                                          onChange={() => saveAnswerVal(qIndex, index, true)}
                                          sx={{ color: '#7d9b17', '&.Mui-checked': { color: '#7d9b17' } }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className='mb-4 mt-2 ms-5 ps-1'>
                              <Button
                                variant='outlined'
                                onClick={() => handleOptionOpen(qIndex)}
                                sx={{ ml: 4, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}
                                startIcon={<HiPlus />}
                              >
                                Add option
                              </Button>
                            </div>
                          </div>
                        )}
                      </Drop>
                    )}
                  </div>
                </Drag>
              ))}
            </Drop>
          </DragAndDrop>
          <Button
            variant='outlined'
            onClick={() => setQuestionModal(true)}
            sx={{ color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none', mt: 2 }}
            startIcon={<HiPlus />}
          >
            Add question
          </Button>

          <div className='d-flex justify-content-end pt-4'>
            <Button variant='outlined' onClick={quizClose} sx={{ mr: 2, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleQuizSubmit} sx={{ bgcolor: '#7d9b17', '&:hover': { bgcolor: '#6b8514' }, textTransform: 'none' }}>
              Save
            </Button>
          </div>
        </div>
      </>

      <Modal
        open={questionModal}
        onClose={handleQuestionClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{ overflowY: 'auto' }}
      >
        <Box sx={style}>
          <QuestionModal
            questionClose={handleQuestionClose}
            questionSave={handleQuestionSave}
            questionData={questionData}
          />
        </Box>
      </Modal>

      <Modal
        open={optionModal}
        onClose={handleOptionClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{ overflowY: 'auto' }}
      >
        <Box sx={style}>
          <OptionModal
            handleOptionClose={handleOptionClose}
            handleOptionSave={handleOptionSave}
            optionData={optionData}
          />
        </Box>
      </Modal>
    </div>
  )
}
