import useMediaQuery from '@mui/material/useMediaQuery'
import { FaTelegramPlane, FaTwitter, FaInstagram, FaLinkedinIn, FaDiscord } from 'react-icons/fa'

const FooterContent = () => {
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25 pt-2 text-black'>
        © {new Date().getFullYear()}{' '}
        <a
          href='/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#372f2f' }}
          className='text-decoration-none'
        >
          CollegeDAO
        </a>
        <span className='d-none d-sm-inline-block text-black'>, All rights Reserved</span>
      </span>
      <span style={{ fontSize: '12px' }} className='float-md-end d-none d-md-block'>
        <span style={{ fontSize: '12px' }} className='px-1 text-black'>
          College Network
        </span>
        <span style={{ fontSize: '12px' }} className='px-1 text-black'>
          Partners
        </span>
        <span className='px-1 text-black'>Roadmap</span>
        <span>
          <FaTelegramPlane className='socialIcon ' size={22} />
          <FaTwitter className='socialIcon ' size={22} />

          <FaDiscord className='socialIcon ' size={22} />
          <FaInstagram className='socialIcon ' size={22} />
          <FaLinkedinIn className='socialIcon ' size={22} />
        </span>
      </span>
    </p>
  )
}

export default FooterContent
