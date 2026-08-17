import DeleteIcon from '@mui/icons-material/Delete'
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RiDeleteBin6Line, RiEdit2Fill } from 'react-icons/ri'
import { RxEyeOpen } from 'react-icons/rx'
import { Col, Row } from 'reactstrap'
import Requests from 'src/configs/axiosRequest'

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
  { id: 'category', numeric: true, disablePadding: false, label: 'Categories' },
  { id: 'status', disablePadding: false, label: 'Status' },
  { id: 'Action', disablePadding: false, label: 'Action', sort: false }
]

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = property => event => onRequestSort(event, property)

  return (
    <TableHead className='border-black' sx={{ '& .css-7aq1j1-MuiButtonBase-root-MuiTableSortLabel-root:hover ': { color: 'black' } }}>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            type='checkbox'
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 24, color: 'black', borderRadius: '4px' }} />}
            checkedIcon={<CheckBoxIcon sx={{ fontSize: 24, color: 'black', border: '2px solid black', borderRadius: '4px' }} />}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className='text-black ps-1'
          >
            {headCell.sort !== false ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                className='text-black ps-1'
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
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
  const { numSelected, filterList, onTagDelete, setIsChange, selected, setSelected } = props
  const requestApiData = new Requests()
  const [open, setOpen] = useState(false)

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => setOpen(false)
  const handleConfirmDelete = () => {
    handleDeleteAllCourses()
    setOpen(false)
  }

  const handleDeleteAllCourses = () => {
    requestApiData
      .deleteCourseManyRequest(selected)
      .then(res => {
        if (res?.status === 200) {
          toast.success('Your course delete successfully')
          setSelected([])
          setIsChange(pre => !pre)
        }
      })
      .catch(error => console.log(error))
  }

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            boxShadow: '0px 2px 4px 1px rgba(12, 16, 27, 0.15), 0px 3px 4px 0px rgba(12, 16, 27, 0.1), 0px 1px 3px 2px rgba(12, 16, 27, 0.08)'
          })
        }}
      >
        {numSelected > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color='black' variant='subtitle1' component='div'>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%', color: '#7d9b17' }} variant='h5' id='tableTitle' component='div' className='ps-4'>
            Courses
          </Typography>
        )}
        {filterList?.length > 0 &&
          filterList?.map((item, index) => (
            <Chip
              key={item}
              label={item}
              variant='outlined'
              onDelete={() => onTagDelete(item)}
              sx={{
                color: 'black',
                borderColor: 'black',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                '& .MuiChip-deleteIcon': { color: 'black', '&:hover': { color: 'black' } }
              }}
            />
          ))}
        {numSelected > 0 && (
          <Tooltip title='Delete' onClick={handleOpenDialog}>
            <IconButton>
              <DeleteIcon className='text-black' />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle className='addHeadingColor'>Confirm Deletion</DialogTitle>
        <DialogContent className='text-black'>Are you sure you want to delete all selected records?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className='beforeLoginbtn'>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='error' className='beforeLoginbtn'>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  filterList: PropTypes.array,
  onTagDelete: PropTypes.func
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }
}

export const EnterpriseCoursesTable = () => {
  const requestApiData = new Requests()
  const searchParams = useSearchParams()
  const action = searchParams.get('from')

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('Categories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [allCourse, setAllCourse] = useState([])
  const [course, setCourse] = useState([])
  const [confirmDelet, setConfirmDelet] = useState(false)
  const [courseId, setCourseId] = useState(null)
  const [filterList, setFilterList] = useState([])
  const [isChange, setIsChange] = useState(false)

  const createdBy = JSON.parse(localStorage.getItem('userData'))

  const modalDeletOpen = id => { setConfirmDelet(true); setCourseId(id) }
  const modalDeletClose = () => { setConfirmDelet(false); setCourseId(null) }

  useEffect(() => {
    getCourseData({ createdBy: createdBy?.id })
  }, [isChange, selected])

  const getCourseData = param => {
    requestApiData
      .courseRequest(param)
      .then(res => {
        if (res?.status === 200) {
          setCourse(res?.data)
          setAllCourse(res?.data)
        }
      })
      .catch(err => console.log('Get Enterprise Courses', err))
  }

  const deleteCourse = id => {
    requestApiData
      .deleteCourseRequest(id)
      .then(res => {
        if (res?.status === 200) {
          setConfirmDelet(false)
          toast.success('Your course delete successfully')
          getCourseData({ createdBy: createdBy?.id })
        }
      })
      .catch(err => {
        toast.error('Somthing went wrong')
        console.log('Delet Course', err)
      })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) { setSelected(course.map(n => n._id)); return }
    setSelected([])
  }

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title)
    let newSelected = []
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, title)
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1))
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1))
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0) }
  const handleTagDelete = tag => { setFilterList([]); setCourse(allCourse) }

  const isSelected = title => selected.indexOf(title) !== -1
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - course.length) : 0

  useEffect(() => {
    if (action === 'drafts') {
      setFilterList(['Drafts'])
      setCourse(pre => pre.filter(item => item.status === 'draft'))
    }
  }, [allCourse])

  return (
    <Box sx={{ width: '100%' }} className='enaterpriseCourseWrap'>
      <Row className='justify-content-between align-items-center pb-5'>
        <Col md={12} className='mb-1 text-end'>
          <Button type='button' className='me-2 px-5 border-0 addCourse'>
            <Link className='text-black text-decoration-none' href='/course-creation'>
              Add Course
            </Link>
          </Button>
        </Col>
      </Row>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'white' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filterList={filterList}
          onTagDelete={handleTagDelete}
          setIsChange={setIsChange}
          selected={selected}
          setSelected={setSelected}
        />
        <TableContainer>
          <Table
            size='small'
            sx={{ minWidth: 750, borderCollapse: 'collapse', '& th , td': { borderBottom: '1px solid #a19d9dbf', padding: '15px' } }}
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
              {stableSort(course, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row?._id)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row?._id} className='customRow'>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isItemSelected}
                          icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 24, color: 'black', borderRadius: '4px' }} />}
                          checkedIcon={<CheckBoxIcon sx={{ fontSize: 24, color: 'black', border: '2px solid black', borderRadius: '4px' }} />}
                          onClick={event => handleClick(event, row?._id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component='th' id={labelId} scope='row' padding='none' className='text-black'>{row.title}</TableCell>
                      <TableCell align='left' className='text-black'>{row.category}</TableCell>
                      <TableCell align='left' className='text-black'>{row.status.toUpperCase()}</TableCell>
                      <TableCell align='left' className='text-black'>
                        <RiDeleteBin6Line className='fs-6' onClick={() => modalDeletOpen(row?._id)} />
                        <Link href={`/course-creation/?id=${row?._id}`}>
                          <RiEdit2Fill className='mx-3 fs-6 text-black' style={{ color: '#fff' }} />
                        </Link>
                        <Link href={`/courses/${row?.slug}/${row?._id}`}>
                          <RxEyeOpen className=' fs-6 text-black' style={{ color: '#fff' }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && <TableRow><TableCell colSpan={6} /></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={course.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='pagination'
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: 'black' },
            '& .MuiSelect-select, & .MuiSelect-icon': { color: 'black' },
            '& .MuiInputBase-root:before, & .MuiInputBase-root:after': { borderColor: 'black' }
          }}
        />
      </Paper>

      <Modal open={confirmDelet} onClose={modalDeletClose} aria-labelledby='modal-modal-title'>
        <Box sx={modalStyle}>
          <Typography id='modal-modal-title' variant='h6' component='h2' className='addHeadingColor'>
            Delete Confirmation
          </Typography>
          <Typography className='text-black mt-2'>Are you sure you want to delete this course?</Typography>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button variant='default' onClick={() => modalDeletClose()} className='me-3 mt-3 beforeLoginbtn border-0'>Cancel</Button>
            <Button variant='danger' onClick={() => deleteCourse(courseId)} className=' mt-3 border-0 beforeLoginbtn'>Delete</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
