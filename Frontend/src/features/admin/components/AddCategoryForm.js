import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Card, Label, Input } from 'reactstrap'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Requests from 'src/configs/axiosRequest'
import { Button } from '@mui/material'
import toast from 'react-hot-toast'

export const AddCategoryForm = () => {
  const router = useRouter()
  const requestApiData = new Requests()
  const [categoryData, setCategoryData] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const user = JSON.parse(window.localStorage.getItem('userData'))

  useEffect(() => {
    const url_str = window.location.href
    let url = new URL(url_str)
    let search_params = url.searchParams
    const updateId = search_params.get('id')

    if (updateId) {
      setCategoryId(updateId)

      requestApiData
        .getOneCategory(updateId)
        .then(res => {
          if (res?.status === 200) {
            setCategoryData(res?.data)
          }
        })
        .catch(err => {
          console.log('oneCategoryRequest in add category', err)
        })
    }
  }, [])

  const validationSchema = yup.object({
    title: yup.string().required('Title is require')
  })

  const formik = useFormik({
    initialValues: {
      title: categoryData?.name ? categoryData.name : '',
      description: categoryData?.description ? categoryData.description : ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: values => {
      if (categoryId) {
        const payload = {
          _id: categoryId,
          name: values.title,
          description: values.description,
          createdBy: user?.id,
          createdName: user?.name,
          status: 'draft'
        }

        requestApiData
          .updateCategoryRequest(payload)
          .then(res => {
            toast.success('You are Successfully update category')
            router.push('/admin-category')
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
      } else {
        const payload = {
          name: values.title,
          description: values.description,
          createdBy: user?.id,
          createdName: user?.name,
          status: 'draft'
        }

        requestApiData
          .createCategoryRequest(payload)
          .then(res => {
            toast.success('You are Successfully add category')
            router.push('/admin-category')
          })
          .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
          })
      }
    }
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box className='text-center'>
          <Card className='border-0 p-4 profile-wrap mt-4 text-start'>
            <Label className='form-label fs-5' for='title'>
              Title
            </Label>
            <Input
              className='profile-input-box'
              name='title'
              type='text'
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            <Label className='form-label fs-5' for='title'>
              Description
            </Label>
            <Input
              className='profile-input-box'
              name='description'
              type='textarea'
              rows='6'
              col='6'
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Card>
        </Box>
        <Box>
          <div className={`d-flex justify-content-lg-between justify-content-sm-end pt-5`}>
            <Button type='submit' className='me-2 px-4 d-flex align-items-center beforeLoginbtn'>
              Submit
            </Button>
          </div>
        </Box>
      </form>
    </div>
  )
}
