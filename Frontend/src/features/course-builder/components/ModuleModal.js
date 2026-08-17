import React, { useState } from 'react'
import { Label, Input } from 'reactstrap'
import { Typography, Button } from '@mui/material'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function ModuleModal({ moduleClose, moduleSave, moduleData }) {
  const [moduleTitle, setModuleTitle] = useState(moduleData?.name ? moduleData.name : '')

  const isEditMode = Boolean(moduleData)

  const handleSubmit = e => {
    e.preventDefault()
    moduleSave(moduleTitle)
  }

  return (
    <div>
      <Typography id='modal-modal-title' className='fs-3 pb-3 addHeadingColor'>
        {isEditMode ? 'Edit Module' : 'Add Module'}
      </Typography>

      <Label className='form-label text-black' for='firstName '>
        Title
      </Label>
      <Input
        className='myprofile'
        name='name'
        type='text'
        defaultValue={moduleTitle}
        onChange={e => setModuleTitle(e.target.value)}
      />
      <div className='d-flex justify-content-end pt-4'>
        <Button type='button' className='me-2 px-4 d-flex align-items-center beforeLoginbtn ' onClick={moduleClose}>
          Cancel
        </Button>
        <Button type='button' className='me-2 px-4 d-flex align-items-center beforeLoginbtn ' onClick={e => handleSubmit(e)}>
          Save
        </Button>
      </div>
    </div>
  )
}
