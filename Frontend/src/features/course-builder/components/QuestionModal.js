import React, { useState } from 'react'
import { Typography, TextField, Button } from '@mui/material'
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
        placeholder='Enter Question Title'
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
      />
      <div className='d-flex justify-content-end pt-4'>
        <Button variant='outlined' onClick={questionClose} sx={{ mr: 2, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button variant='contained' onClick={e => handleSubmit(e)} sx={{ bgcolor: '#7d9b17', '&:hover': { bgcolor: '#6b8514' }, textTransform: 'none' }}>
          Save
        </Button>
      </div>
    </div>
  )
}
