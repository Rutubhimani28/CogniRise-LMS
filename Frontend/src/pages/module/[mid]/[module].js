import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TextField, CircularProgress, Typography } from '@mui/material'
import { RiDeleteBin6Line, RiEdit2Fill } from 'react-icons/ri'
import { RxEyeOpen } from 'react-icons/rx'
import Link from 'next/link'
import Requests from 'src/configs/axiosRequest'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { Row, Col } from 'reactstrap'

const ModulesData = () => {
  const [courseId, setCourseId] = useState(null)
  const [modulesData, setModulesData] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const requestApiData = new Requests()

  const user = JSON.parse(window.localStorage.getItem('userData'))

  useEffect(() => {
    const id = router?.query?.mid
    setCourseId(id)
    getCourseData(id)
  }, [])

  const getCourseData = async id => {
    setLoading(true)
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
      .finally(() => {
        setLoading(false)
      })
  }

  {
    console.log('module', modulesData !== undefined && modulesData.modules)
  }

  const modulesList = modulesData?.modules || []
  const filteredModules = modulesList.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Box sx={{ width: '100%', p: 3 }} className='moduleWrap'>
      <Row className='justify-content-between align-items-center pb-3'>
        <Col md={6} className='mb-1'>
          <Typography sx={{ fontSize: '1.3rem', color: '#7d9b17' }} variant='h6' className='addHeadingColor'>
            Modules
          </Typography>
        </Col>
        <Col md={6} className='mb-1 text-end'>
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: '300px' }}
            />
          </Box>
        </Col>
      </Row>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: 'white' }}>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ height: '300px', borderBottom: 'none !important' }}>
                  <CircularProgress sx={{ color: '#7d9b17' }} />
                </TableCell>
              </TableRow>
            ) : filteredModules.length > 0 ? (
              filteredModules.map((item, i) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No modules found</TableCell>
              </TableRow>
            )}
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
