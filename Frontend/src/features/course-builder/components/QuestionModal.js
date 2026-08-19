import React, { useState } from 'react'
import { Label, Input, Button } from 'reactstrap'
import { Typography, TextField } from '@mui/material'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function QuestionModal({ questionClose, questionSave, questionData }) {
  const [questionTitle, setQuestionTitle] = useState(questionData?.name ? questionData.name : '')

  const handleSubmit = e => {
    e.preventDefault()
    questionSave(questionTitle)
  }

  return (
    <div>
      <Typography id='modal-modal-title' className='fs-3 pb-3 addHeadingColor'>
        Edit Question
      </Typography>

      <TextField
        fullWidth
        label='Title'
        name='name'
        value={questionTitle}
        onChange={e => setQuestionTitle(e.target.value)}
        InputLabelProps={{ shrink: true }}
        placeholder='Enter Question Title'
        sx={{ mb: 3 }}
      />
      <div className='d-flex justify-content-end pt-4'>
        <Button type='button' className='me-2 px-4 d-flex align-items-center beforeLoginbtn' onClick={questionClose}>
          Cancel
        </Button>
        <Button type='button' className='me-2 px-4 d-flex align-items-center beforeLoginbtn' onClick={e => handleSubmit(e)}>
          Save
        </Button>
      </div>
    </div>
  )
}
