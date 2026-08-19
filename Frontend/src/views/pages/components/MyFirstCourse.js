import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { FaPlus } from 'react-icons/fa'

export default function MyFirstCourse() {
  const router = useRouter()

  return (
    <Box className='learnningTimeBox' sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px' }}>
      <Button variant='outlined' onClick={() => router.push('/Course-listing')} sx={{ borderColor: '#4f46e5', color: '#4f46e5', borderRadius: '8px', py: 1, px: 3, '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)', borderColor: '#4f46e5' } }}>
        <FaPlus size={20} className='me-2' /> Add my first course
      </Button>
    </Box>
  )
}

