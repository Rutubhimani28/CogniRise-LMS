import React, { useState } from 'react'
import { Typography, TextField, Button } from '@mui/material'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function OptionModal({ handleOptionClose, handleOptionSave, data }) {
  const [titleDesc, setTitleDesc] = useState(data?.name || '')

  const handleSubmit = e => {
    e.preventDefault()
    handleOptionSave(titleDesc)
  }

  return (
    <div>
      <Typography id='modal-modal-title ' className='fs-3 pb-3 addHeadingColor'>
        Edit option
      </Typography>

      <TextField
        fullWidth
        label='Title'
        name='name'
        value={titleDesc}
        onChange={e => setTitleDesc(e.target.value)}
        placeholder='Enter Option Title'
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px', '&:hover fieldset': { borderColor: '#7d9b17' }, '&.Mui-focused fieldset': { borderColor: '#7d9b17', borderWidth: '2px' } } }}
      />
      <div className='d-flex justify-content-end pt-4'>
        <Button variant='outlined' onClick={handleOptionClose} sx={{ mr: 2, color: '#7d9b17', borderColor: '#7d9b17', '&:hover': { borderColor: '#6b8514', backgroundColor: 'rgba(125, 155, 23, 0.04)' }, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button variant='contained' onClick={e => handleSubmit(e)} sx={{ bgcolor: '#7d9b17', '&:hover': { bgcolor: '#6b8514' }, textTransform: 'none' }}>
          Save
        </Button>
      </div>
    </div>
  )
}
