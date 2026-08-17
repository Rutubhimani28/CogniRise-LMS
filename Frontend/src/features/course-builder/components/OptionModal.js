import React, { useState } from 'react'
import { Label, Input, Button } from 'reactstrap'
import { Typography } from '@mui/material'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function OptionModal({ handleOptionClose, handleOptionSave, data }) {
  const [titleDesc, setTitleDesc] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    handleOptionSave(titleDesc)
  }

  return (
    <div>
      <Typography id='modal-modal-title ' className='fs-3 pb-3 addHeadingColor'>
        Edit option
      </Typography>

      <Label className='form-label text-black' for='firstName'>
        Title
      </Label>
      <Input
        className='profile-input-box setProfiletext'
        name='name'
        type='text'
        defaultValue={data?.name || ''}
        onChange={e => setTitleDesc(e.target.value)}
      />
      <div className='d-flex justify-content-end pt-4'>
        <Button
          type='button'
          className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
          onClick={handleOptionClose}
        >
          Cancel
        </Button>
        <Button
          type='button'
          className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
          onClick={e => handleSubmit(e)}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
