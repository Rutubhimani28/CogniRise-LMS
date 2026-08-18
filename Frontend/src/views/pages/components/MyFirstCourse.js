import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { FaPlus } from 'react-icons/fa'

export default function MyFirstCourse() {
  const router = useRouter()

  return (
    <Box className='learnningTimeBox' sx={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px' }}>
      <Button variant='outlined' onClick={() => router.push('/Course-listing')} sx={{ borderColor: '#7d9b17', color: '#7d9b17', borderRadius: '8px', py: 1, px: 3, '&:hover': { backgroundColor: 'rgba(125, 155, 23, 0.08)', borderColor: '#7d9b17' } }}>
        <FaPlus size={20} className='me-2' /> Add my first course
      </Button>
    </Box>
  )
}
