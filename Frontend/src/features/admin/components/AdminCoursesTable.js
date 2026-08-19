import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import Link from 'next/link'
import Requests from 'src/configs/axiosRequest'
import { Button } from '@mui/material'
import Modal from '@mui/material/Modal'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Row, Col } from 'reactstrap'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1

  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

const headCells = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Course' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Categories' },
  { id: 'enterprise', numeric: false, disablePadding: false, label: 'Enterprise' },
  { id: 'createdDate', numeric: true, disablePadding: false, label: 'Created Date' },
  { id: 'approvals', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'action', disablePadding: false, label: 'Action', align: 'center' }
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => onRequestSort(event, property)

  return (
    <TableHead
      sx={{
        '& .css-7aq1j1-MuiButtonBase-root-MuiTableSortLabel-root:hover ': {
          color: 'black'
        }
      }}
    >
      <TableRow>
        <TableCell padding='checkbox'>{''}</TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className='text-black ps-1'
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

function EnhancedTableToolbar(props) {
  const { numSelected } = props
  if (numSelected === 0) {
    return null
  }

  return (
    <Toolbar
      variant='dense'
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        minHeight: '48px !important',
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
        {numSelected} selected
      </Typography>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }
}

export const AdminCoursesTable = () => {
  const requestApiData = new Requests()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('Categories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [course, setCourse] = useState([])
  const [categories, setCategories] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmApprove, setConfirmApprove] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [courseId, setCourseId] = useState({})

  const modalApproveOpen = item => {
    setConfirmApprove(true)
    setCourseId(item)
  }

  const modalApproveClose = () => {
    setConfirmApprove(false)
    setCourseId(null)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCourseData(),
      requestApiData.getCategories().then(res => {
        if (res?.status === 200) {
          setCategories(res?.data)
        }
      }).catch(err => {
        console.log('Get all categories', err)
      })
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  const getCourseData = () => {
    return requestApiData
      .courseRequest()
      .then(res => {
        if (res?.status === 200) {
          const fetchedCourses = res?.data.filter(item => item.status != 'draft')
          setCourse(fetchedCourses)

          const uniqueIds = [...new Set(fetchedCourses.map(c => c.createdBy).filter(Boolean))]
          const nameMap = {}
          Promise.all(
            uniqueIds.map(id =>
              requestApiData.getUserById(id).then(r => {
                if (r?.status === 200) {
                  nameMap[id] = r.data?.profile?.name || r.data?.name || r.data?.email || id
                }
              }).catch(() => { })
            )
          ).then(() => setUsersMap(prev => ({ ...prev, ...nameMap })))
        }
      })
      .catch(err => {
        console.log('Get all courses', err)
      })
  }

  const getCategoryName = (categoryId) => {
    const found = categories.find(cat => cat._id === categoryId)

    return found ? found.name : categoryId
  }

  const getCreatorName = (createdBy, createdName) => {
    if (usersMap[createdBy]) return usersMap[createdBy]
    if (createdName) return createdName

    return ''
  }

  const approveCourse = data => {
    setIsApproving(true)
    const payload = {
      _id: data.id,
      status: 'approve',
      approvals: data.status === 'course_update' ? 'course_update' : 'course_approve'
    }
    requestApiData
      .updateCourseRequest(payload)
      .then(res => {
        if (res?.status === 200) {
          setConfirmApprove(false)
          toast.success('Your course approve successfully')
          getCourseData()
        }
      })
      .catch(err => {
        toast.error('Something went wrong')
      })
      .finally(() => {
        setIsApproving(false)
      })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = course.map(n => n.title)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = title => selected.indexOf(title) !== -1

  const filteredCourse = course.filter((row) =>
    row?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(row.category)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCreatorName(row.createdBy, row.createdName)?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourse.length) : 0

  return (
    <Box sx={{ width: '100%' }} className='enaterpriseCourseWrap'>
      <Row className='justify-content-between align-items-center pb-3'>
        <Col md={6} className='mb-1'>
          <Typography sx={{ fontSize: '1.3rem', color: '#4f46e5' }} variant='h6' className='addHeadingColor'>
            Course Approvals
          </Typography>
        </Col>
        <Col md={6} className='text-end'>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: '300px' }}
          />
        </Col>
      </Row>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'white' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
        />
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
          <Table
            stickyHeader
            size='small'
            sx={{
              minWidth: 750,
              borderCollapse: 'collapse',
              '& th , td': { borderBottom: '1px solid #a19d9dbf', padding: '5px' }
            }}
            aria-labelledby='tableTitle'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={course.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ height: '300px', borderBottom: 'none !important' }}>
                    <CircularProgress sx={{ color: '#4f46e5' }} />
                  </TableCell>
                </TableRow>
              ) : filteredCourse.length === 0 ? (<TableRow><TableCell colSpan={7} align='center' sx={{ height: '300px', borderBottom: 'none !important' }}><Typography variant='h6' color='textSecondary'>No data found</Typography></TableCell></TableRow>) : stableSort(filteredCourse, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.title)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.title}>
                      <TableCell padding='checkbox' sx={{ py: 0.5, px: 1 }}></TableCell>
                      <TableCell
                        align='left'
                        id={labelId}
                        scope='row'
                        padding='none'
                        className='text-black '
                        sx={{ py: 0.5, px: 1 }}
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align='left' className='text-black ' sx={{ py: 0.5, px: 1 }}>
                        {getCategoryName(row.category)}
                      </TableCell>
                      <TableCell align='left' className='text-black ' sx={{ py: 0.5, px: 1 }}>
                        {getCreatorName(row.createdBy, row.createdName)}
                      </TableCell>
                      <TableCell align='left' className='text-black ' sx={{ py: 0.5, px: 1 }}>
                        {moment(row.createdAt).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell align='left' className='text-black ' sx={{ py: 0.5, px: 1 }}>
                        {row.status === 'approve' ? 'Published' : row.status}
                      </TableCell>
                      <TableCell align='center' sx={{ py: 0.5, px: 1 }}>
                        <Link className='text-light text-decoration-none' href={`/courses/${row?.slug || 'unknown'}/${row?._id}`}>
                          <Button variant='contained' size='small' sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, mr: 1, textTransform: 'none' }}>
                            Preview
                          </Button>
                        </Link>
                        {row?.status === 'pending' ? (
                          <Button
                            variant='contained'
                            size='small'
                            onClick={() => modalApproveOpen({ id: row?._id, status: row?.approvals })}
                            sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' }, textTransform: 'none' }}
                          >
                            Approve
                          </Button>
                        ) : (
                          ''
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredCourse.length > 0 && (<TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredCourse.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='pagination'
          sx={{
            '& .css-14s6usd-MuiSvgIcon-root-MuiSelect-icon': {
              color: 'black'
            }
          }}
        />
        )}
      </Paper>

      <Modal
        open={confirmApprove}
        onClose={modalApproveClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={modalStyle}>
          <Typography id='modal-modal-title' variant='h6' component='h2' color={'#4f46e5'}>
            Approval Confirmation
          </Typography>
          <Typography id='modal-modal-description' className='text-black mt-2'>
            Are you sure you want to approve this course?
          </Typography>
          <Box display={'flex'} justifyContent='end'>
            <Button variant='outlined' onClick={() => modalApproveClose()} sx={{ mr: 2, mt: 3, color: '#4f46e5', borderColor: '#4f46e5', '&:hover': { borderColor: '#4338ca' }, textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant='contained' disabled={isApproving} onClick={() => approveCourse(courseId)} sx={{ mt: 3, bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' }, textTransform: 'none' }}>
              {isApproving ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

