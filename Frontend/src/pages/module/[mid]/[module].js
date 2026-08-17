import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { RiDeleteBin6Line, RiEdit2Fill } from 'react-icons/ri'
import { RxEyeOpen } from 'react-icons/rx'
import Link from 'next/link'
import Requests from 'src/configs/axiosRequest'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

const ModulesData = () => {
  const [courseId, setCourseId] = useState(null)
  const [modulesData, setModulesData] = useState({})
  const router = useRouter()
  const requestApiData = new Requests()

  const user = JSON.parse(window.localStorage.getItem('userData'))

  useEffect(() => {
    const id = router?.query?.mid
    setCourseId(id)
    getCourseData(id)
  }, [])

  const getCourseData = async id => {
    await requestApiData
      .oneCourseRequest(id)
      .then(res => {
        if (res?.status === 200) {
          setModulesData(res?.data)
        }
      })
      .catch(err => {
        console.log('oneCourseRequest', err)
      })
  }

  {
    console.log('module', modulesData !== undefined && modulesData.modules)
  }

  return (
    <Box className='moduleWrap'>
      <TableContainer sx={{ maxHeight: 440 }} style={{ border: '1px solid grey' }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead
            sx={{
              '& .css-7aq1j1-MuiButtonBase-root-MuiTableSortLabel-root:hover ': {
                color: 'black'
              }
            }}
          >
            <TableRow>
              <TableCell className='text-center fs-6'>Module Name </TableCell>
              <TableCell className='text-center fs-6'> Action </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modulesData.modules !== 'undefined' &&
              modulesData.modules != null &&
              modulesData.modules.length > 0 &&
              modulesData.modules.map((item, i) => (
                <TableRow hover tabIndex={-1} key={i}>
                  <TableCell component='th' scope='row' padding='none' className='text-center py-3'>
                    {item.name}
                  </TableCell>
                  <TableCell className='text-center'>
                    <RiDeleteBin6Line className='fs-6' onClick={() => modalDeletOpen(item?.id)} />
                    <Link href={`/course-creation/?id=${item?.id}`}>
                      <RiEdit2Fill className='mx-3 fs-6' style={{ color: 'black' }} />
                    </Link>
                    <Link href={`/course/${item?.id}/${item?.name}`}>
                      <RxEyeOpen className=' fs-6' style={{ color: '' }} modulesPassData={modulesData} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

ModulesData.acl = {
  subject: 'student',
  subject: 'enterprise'
}

export default ModulesData
