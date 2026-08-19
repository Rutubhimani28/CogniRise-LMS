import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TextField from '@mui/material/TextField'
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
import { Col, Row } from 'reactstrap'
import { Button } from '@mui/material'
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
        <TableCell padding='checkbox' sx={{ py: 0, px: 1 }}>
          <Checkbox
            type='checkbox'
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20, color: 'black', borderRadius: '4px' }} />}
            checkedIcon={<CheckBoxIcon sx={{ fontSize: 20, color: 'black', border: '2px solid black', borderRadius: '4px' }} />}
            sx={{ padding: '4px' }}
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
          boxShadow:
            '0px 2px 4px 1px rgba(12, 16, 27, 0.15), 0px 3px 4px 0px rgba(12, 16, 27, 0.1), 0px 1px 3px 2px rgba(12, 16, 27, 0.08)'
        })
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color='black' variant='subtitle1' component='div'>
        {numSelected} selected
      </Typography>
      <Tooltip title='Delete'>
        <IconButton onClick={() => setMultiDeleteModel(true)}>
          <DeleteIcon className='text-black' />
        </IconButton>
      </Tooltip>
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
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [category, setCategory] = useState([])
  const [confirmDelet, setConfirmDelet] = useState(false)
  const [multiDeleteModel, setMultiDeleteModel] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMultiDeleting, setIsMultiDeleting] = useState(false)
  const [categoryId, setCategoryId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [createdBy, setCreatedBy] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCreatedBy(JSON.parse(window.localStorage.getItem('userData')))
    }
  }, [])

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
    if (createdBy?.id) {
      const param = { createdBy: createdBy.id }
      getCategoryData(param)
    }
  }, [createdBy])

  const getCategoryData = param => {
    setLoading(true)
    requestApiData
      .getCategories(param)
      .then(res => {
        if (res?.status === 200) setCategory(res?.data)
      })
      .catch(err => console.log('Get Enterprise categories', err))
      .finally(() => setLoading(false))
  }

  const deleteCategory = id => {
    setIsDeleting(true)
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
        toast.error('Something went wrong')
        console.log('Delet Category', err)
      })
      .finally(() => setIsDeleting(false))
  }

  const multiDeleteCategory = () => {
    setIsMultiDeleting(true)
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
        toast.error('Something went wrong')
        console.log('Delet Category', err)
      })
      .finally(() => setIsMultiDeleting(false))
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

  const filteredCategory = category.filter((row) =>
    row?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCategory.length) : 0

  return (
    <Box sx={{ width: '100%' }} className='enaterpriseCategoryWrap'>
      <Row className='justify-content-between align-items-center pb-3'>
        <Col md={6} className='mb-1'>
          <Typography sx={{ fontSize: '1.3rem' }} variant='h6' className='addHeadingColor'>
            Categories
          </Typography>
        </Col>
        <Col md={6} className='mb-1'>
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: '300px' }}
            />
            <Button type='button' size='small' className='px-4 border-0 beforeLoginbtn text-black' style={{ height: '40px' }}>
              <Link className='text-black text-decoration-none' href='/add-category'>
                Add Category
              </Link>
            </Button>
          </Box>
        </Col>
      </Row>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'white' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          setMultiDeleteModel={setMultiDeleteModel}
        />
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ height: '300px', borderBottom: 'none !important' }}>
                    <CircularProgress sx={{ color: '#4f46e5' }} />
                  </TableCell>
                </TableRow>
              ) : filteredCategory.length === 0 ? (<TableRow><TableCell colSpan={5} align='center' sx={{ height: '300px', borderBottom: 'none !important' }}><Typography variant='h6' color='textSecondary'>No data found</Typography></TableCell></TableRow>) : stableSort(filteredCategory, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row?._id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row?._id}>
                      <TableCell padding='checkbox' sx={{ py: 0, px: 1 }}>
                        <Checkbox
                          checked={isItemSelected}
                          icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20, color: 'black', borderRadius: '4px' }} />}
                          checkedIcon={<CheckBoxIcon sx={{ fontSize: 20, color: 'black', border: '2px solid black', borderRadius: '4px' }} />}
                          onClick={event => handleClick(event, row?._id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                          sx={{ padding: '4px' }}
                        />
                      </TableCell>
                      <TableCell component='th' id={labelId} scope='row' padding='none' className='text-black' sx={{ py: 1, px: 1 }}>
                        {row.name}
                      </TableCell>
                      <TableCell align='left' className='text-black' sx={{ py: 1, px: 1, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.description}
                      </TableCell>
                      <TableCell align='left' className='text-black' sx={{ py: 1, px: 1 }}>
                        {row.status.toUpperCase()}
                      </TableCell>
                      <TableCell align='left' className='text-black' sx={{ py: 1, px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <RiDeleteBin6Line className='fs-5 cursor-pointer text-danger' onClick={() => modalDeletOpen(row?._id)} />
                          <Link href={`/add-category/?id=${row?._id}`}>
                            <RiEdit2Fill className='fs-5 cursor-pointer' style={{ color: '#4f46e5' }} />
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredCategory.length > 0 && (<TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredCategory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className='pagination'
          sx={{ '& .css-14s6usd-MuiSvgIcon-root-MuiSelect-icon': { color: 'black' } }}
        />
        )}
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
            <Button variant='outlined' onClick={() => multiDeleteModelClose()} sx={{ mr: 2, mt: 3, color: '#4f46e5', borderColor: '#4f46e5', '&:hover': { borderColor: '#4338ca' }, textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant='contained' disabled={isMultiDeleting} onClick={() => multiDeleteCategory()} sx={{ mt: 3, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' }, textTransform: 'none' }}>
              {isMultiDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
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
            <Button variant='outlined' onClick={() => modalDeletClose()} sx={{ mr: 2, mt: 3, color: '#4f46e5', borderColor: '#4f46e5', '&:hover': { borderColor: '#4338ca' }, textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant='contained' disabled={isDeleting} onClick={() => deleteCategory(categoryId)} sx={{ mt: 3, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' }, textTransform: 'none' }}>
              {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

