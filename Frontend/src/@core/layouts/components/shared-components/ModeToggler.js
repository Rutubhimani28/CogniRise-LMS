import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { NavItem, NavLink } from 'reactstrap'
import Link from 'next/link'

const ModeToggler = props => {
  const ability = useContext(AbilityContext)

  let link1 = ''
  let linkText1 = ''
  let link2 = ''
  let linkText2 = ''

  if (ability?.can('manage', 'student')) {
    link1 = ''
    link2 = ''
  } else if (ability?.can('manage', 'enterprise')) {
    link1 = '/enterprise-courses'
    linkText1 = 'Courses'
  }

  return (
    <>
      {link1 ? (
        <NavItem className='my-1 me-lg-4 me-sm-2 fs-5  list-unstyled header-menu'>
          <Link href={link1} className='cursor-pointer'>
            {linkText1}
          </Link>
        </NavItem>
      ) : (
        ''
      )}
    </>
  )
}

export default ModeToggler
