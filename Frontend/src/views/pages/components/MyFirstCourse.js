import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { FaPlus } from 'react-icons/fa'

export default function MyFirstCourse() {
  const router = useRouter()

  return (
    <Box>
      <div className='learnningTimeBox blockchainBox row justify-content-between me-0 '>
        <div className='d-flex justify-content-center my-5'>
          <Button variant='text' className='addFirstCourse' onClick={() => router.push('/Course-listing')}>
            <FaPlus size={30} className='addHeadingColor' /> <span className='px-2 addHeadingColor'> Add my first course</span>
          </Button>
        </div>
      </div>
    </Box>
  )
}
