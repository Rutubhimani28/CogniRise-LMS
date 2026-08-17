import DeleteIcon from '@mui/icons-material/Delete'
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
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RiDeleteBin6Line, RiEdit2Fill } from 'react-icons/ri'
import { Button, Col, Row } from 'reactstrap'
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
  { id: 'name', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'description', numeric: true, disablePadding: false, label: 'Description' },
  { id: 'status', disablePadding: false, label: 'Status' },
  { id: 'Action', disablePadding: false, label: 'Action', sort: false }
]

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = property => event => onRequestSort(event, property)

  return (
    <TableHead sx={{ '& .css-7aq1j1-MuiButtonBase-root-MuiTableSortLabel-root:hover ': { color: 'black' } }}>
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
  const { numSelected, setMultiDeleteModel } = props
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          boxShadow:
            '0px 2px 4px 1px rgba(12, 16, 27, 0.15), 0px 3px 4px 0px rgba(12, 16, 27, 0.1), 0px 1px 3px 2px rgba(12, 16, 27, 0.08)'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='black' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h5' id='tableTitle' component='div' className='ps-4 addHeadingColor'>
          categories
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title='Delete'>
          <IconButton onClick={() => setMultiDeleteModel(true)}>
            <DeleteIcon className='text-black' />
          </IconButton>
        </Tooltip>
      )}
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
  width: { xs: '90%', sm: '80%', md: 600 },
  bgcolor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }
}

export const AdminCategoryTable = () => {
  const requestApiData = new Requests()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('Categories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [category, setCategory] = useState([])
  const [confirmDelet, setConfirmDelet] = useState(false)
  const [multiDeleteModel, setMultiDeleteModel] = useState(false)
  const [categoryId, setCategoryId] = useState(null)

  const createdBy = JSON.parse(localStorage.getItem('userData'))

  const modalDeletOpen = id => {
    setConfirmDelet(true)
    setCategoryId(id)
  }

  const modalDeletClose = () => {
    setConfirmDelet(false)
    setCategoryId(null)
  }

  const multiDeleteModelClose = () => {
    setMultiDeleteModel(false)
    setSelected([])
  }

  useEffect(() => {
    const param = { createdBy: createdBy?.id }
    getCategoryData(param)
  }, [])

  const getCategoryData = param => {
    requestApiData
      .getCategories(param)
      .then(res => {
        if (res?.status === 200) setCategory(res?.data)
      })
      .catch(err => console.log('Get Enterprise categories', err))
  }

  const deleteCategory = id => {
    requestApiData
      .deleteCategoryRequest(id)
      .then(res => {
        if (res?.status === 200) {
          setConfirmDelet(false)
          toast.success('Your category delete successfully')
          getCategoryData({ createdBy: createdBy?.id })
        }
      })
      .catch(err => {
        toast.error('Somthing went wrong')
        console.log('Delet Category', err)
      })
  }

  const multiDeleteCategory = () => {
    requestApiData
      .deleteManyCategoryRequest(selected)
      .then(res => {
        if (res?.status === 200) {
          multiDeleteModelClose()
          toast.success('Selected category delete successfully')
          getCategoryData({ createdBy: createdBy?.id })
        }
      })
      .catch(err => {
        toast.error('Somthing went wrong')
        console.log('Delet Category', err)
      })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      setSelected(category.map(n => n?._id))
      return
    }
    setSelected([])
  }

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = title => selected.indexOf(title) !== -1
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - category.length) : 0

  return (
    <Box sx={{ width: '100%' }} className='enaterpriseCategoryWrap'>
      <Row className='justify-content-between align-items-center pb-5'>
        <Col md={12} className='mb-1 text-end'>
          <Button type='button' className='me-2 px-5 border-0 beforeLoginbtn text-black'>
            <Link className='text-black text-decoration-none' href='/add-category'>
              Add Category
            </Link>
          </Button>
        </Col>
      </Row>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'white' }}>
        <EnhancedTableToolbar numSelected={selected.length} setMultiDeleteModel={setMultiDeleteModel} />
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table
            stickyHeader
            size='small'
            sx={{ minWidth: 750, borderCollapse: 'collapse', '& th , td': { borderBottom: '1px solid #a19d9dbf' } }}
            aria-labelledby='tableTitle'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={category.length}
            />
            <TableBody>
              {stableSort(category, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row?._id)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row?._id}>
                      <TableCell padding='checkbox' className='py-3'>
                        <Checkbox
                          checked={isItemSelected}
                          icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 24, color: 'black', borderRadius: '4px' }} />}
                          checkedIcon={<CheckBoxIcon sx={{ fontSize: 24, color: 'black', border: '2px solid black', borderRadius: '4px' }} />}
                          onClick={event => handleClick(event, row?._id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component='th' id={labelId} scope='row' padding='none' className='text-black'>
                        {row.name}
                      </TableCell>
                      <TableCell align='left' className='text-black'>{row.description}</TableCell>
                      <TableCell align='left' className='text-black'>{row.status.toUpperCase()}</TableCell>
                      <TableCell align='left' className='text-black'>
                        <RiDeleteBin6Line className='fs-6' onClick={() => modalDeletOpen(row?._id)} />
                        <Link href={`/add-category/?id=${row?._id}`}>
                          <RiEdit2Fill className='mx-3 fs-6' style={{ color: 'black' }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={category.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='pagination'
          sx={{ '& .css-14s6usd-MuiSvgIcon-root-MuiSelect-icon': { color: 'black' } }}
        />
      </Paper>

      {/* Multi Delete Modal */}
      <Modal open={multiDeleteModel} onClose={multiDeleteModelClose} aria-labelledby='modal-modal-title'>
        <Box sx={modalStyle}>
          <Typography id='modal-modal-title' variant='h6' component='h2' className='addHeadingColor'>
            Delete Confirmation
          </Typography>
          <Typography className='text-black' sx={{ mt: 2 }}>
            Are you sure you want to delete all course records? This action cannot be undone.
          </Typography>
          <Box display={'flex'} justifyContent={'end'}>
            <Button variant='default' onClick={() => multiDeleteModelClose()} className='me-3 mt-3 beforeLoginbtn border-0'>
              Cancel
            </Button>
            <Button variant='danger' onClick={() => multiDeleteCategory()} className=' mt-3 border-0 beforeLoginbtn'>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Single Delete Modal */}
      <Modal open={confirmDelet} onClose={modalDeletClose} aria-labelledby='modal-modal-title'>
        <Box sx={modalStyle}>
          <Typography id='modal-modal-title' variant='h6' component='h2' className='addHeadingColor'>
            Delete Confirmation
          </Typography>
          <Typography className='text-black' sx={{ mt: 2 }}>
            Are you sure you want to delete this category?
          </Typography>
          <Box display={'flex'} justifyContent={'end'}>
            <Button variant='default' onClick={() => modalDeletClose()} className='me-3 mt-3 beforeLoginbtn border-0'>
              Cancel
            </Button>
            <Button variant='danger' onClick={() => deleteCategory(categoryId)} className=' mt-3 border-0 beforeLoginbtn'>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
