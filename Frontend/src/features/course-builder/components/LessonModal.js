import React, { useEffect, useState, useCallback } from 'react'
import { Button, Label } from 'reactstrap'
import { Typography, Box, TextField } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { FaPlus } from 'react-icons/fa'

export default function LessonModal({ lessonClose, lessonSave, lessonData }) {
  const [files, setFiles] = useState([])
  const [lessonName, setLessonName] = useState(lessonData?.name || '')
  const [previewImage, setPreviewImage] = useState(null)
  const [value, setValue] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (lessonData) {
      if (lessonData.desc) {
        try {
          const contentState = convertFromRaw(lessonData.desc)
          setValue(EditorState.createWithContent(contentState))
        } catch (error) {
          console.error('Error parsing lesson content:', error)
          setValue(EditorState.createEmpty())
        }
      }

      if (lessonData.file) {
        if (typeof lessonData.file === 'string') {
          setPreviewImage(lessonData.file)
        } else {
          const reader = new FileReader()
          reader.onload = () => {
            setPreviewImage(reader.result)
          }
          reader.readAsDataURL(lessonData.file)
        }
      }
    }
  }, [lessonData])

  const handleSubmit = e => {
    e.preventDefault()

    try {
      const rawContentState = convertToRaw(value.getCurrentContent())

      let filePayload
      if (files.length > 0) {
        filePayload = files[0]
      } else if (previewImage && !previewImage.startsWith('data:')) {
        filePayload = lessonData?.file
      } else if (previewImage) {
        filePayload = previewImage
      }

      const lessonPayload = {
        name: lessonName,
        file: filePayload,
        desc: rawContentState
      }

      lessonSave(lessonPayload)
    } catch (error) {
      console.error('Error submitting lesson:', error)
    }
  }

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      reader.onload = () => {
        setFiles([file])
        setPreviewImage(reader.result)
      }

      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4']
    },
    onDrop
  })

  const renderPreview = () => {
    if (!previewImage) {
      return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
          <FaPlus className='add-buttone text-white' fontSize={25} />
          <span className='text-black'>Choose a file or drag and drop it here</span>
        </Box>
      )
    }

    try {
      if (previewImage.startsWith('data:image')) {
        return <img className='single-file-image' src={previewImage} width='100px' height='100px' alt='Preview' />
      } else if (previewImage.startsWith('http')) {
        return <img className='single-file-image' src={previewImage} width='100px' height='100px' alt='Existing' />
      }
    } catch (error) {
      console.error('Error rendering preview:', error)

      return null
    }

    return null
  }

  return (
    <div style={{ overflowY: 'auto' }}>
      <Typography id='modal-modal-title' className='fs-3 pb-3 addHeadingColor'>
        Edit Lesson: Let's Get Started
      </Typography>

      <TextField
        fullWidth
        label='Title'
        name='name'
        value={lessonName}
        onChange={e => setLessonName(e.target.value)}
        InputLabelProps={{ shrink: true }}
        placeholder='Enter Lesson Title'
        sx={{ mb: 3 }}
      />

      <Box
        {...getRootProps({ className: 'dropzone' })}
        sx={previewImage ? { height: 150 } : {}}
        style={{ border: '2px dashed #414141', borderRadius: '5px', padding: '20px' }}
      >
        <input {...getInputProps()} />
        {renderPreview()}
      </Box>

      <Typography variant='body2' sx={{ mb: 2.5 }} className='text-black py-2'>
        File types supported: JPG, PNG. Max Size: 5 MB
      </Typography>

      <Label className='form-label text-black' for='firstName'>
        Lesson Content
      </Label>
      <div className='custom-editor'>
        <ReactDraftWysiwyg
          editorState={value}
          onEditorStateChange={data => setValue(data)}
          toolbar={{
            options: ['blockType', 'inline', 'list'],
            inline: {
              options: ['bold', 'italic']
            },
            blockType: {
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
            },
            list: {
              options: ['unordered', 'ordered']
            }
          }}
        />
      </div>

      <div className='d-flex justify-content-end pt-4'>
        <Button
          type='button'
          className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
          onClick={lessonClose}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='me-2 px-4 d-flex align-items-center beforeLoginbtn'
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
