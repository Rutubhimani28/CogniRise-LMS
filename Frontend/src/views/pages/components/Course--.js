import React, { useEffect, useState } from 'react'
import {
  CardText,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  List
} from 'reactstrap'
import { RiArrowDropDownLine, RiDeleteBin6Line } from 'react-icons/ri'
import { RxEyeOpen } from 'react-icons/rx'
import imgConst from 'src/configs/imgConst'
import Link from 'next/link'
import Requests from 'src/configs/axiosRequest'

export default function Course({ direction, ...args }) {
  const requestApiData = new Requests()
  const [course, setCourse] = useState([])
  const [enterprise, setEnterprise] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sectionOpen, setSectionOpen] = useState(false)

  useEffect(() => {
    requestApiData
      .courseRequest()
      .then(res => {
        if (res?.status === 200) {
          setCourse(res?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    requestApiData
      .enterpriseRequest()
      .then(res => {

        if (res?.status === 200) {
          setEnterprise(res?.data)
        }

      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const deleteCourse = id => {
    requestApiData
      .deleteCourseRequest(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('Your course delete successfully')
        }
      })
      .catch(err => {
        toast.error('Something went wrong')
        console.log('Delet Course', err)
      })
  }

  const toggle = () => setDropdownOpen(prevState => !prevState)

  return (
    <div className='courseAccordianWrap'>
      <div className='accordianHeading row m-0'>
        <div className='col-lg-3 coursePart justify-content-start ps-3'>
          <FormGroup check inline className='d-flex align-items-center'>
            <Input type='checkbox' />
            <Label check>
              <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
                <DropdownToggle className='btnCourse'>
                  Course
                  <RiArrowDropDownLine size={24} />
                </DropdownToggle>
                <DropdownMenu {...args}>
                  <DropdownItem>Foo Action</DropdownItem>
                  <DropdownItem>Bar Action</DropdownItem>
                  <DropdownItem>Quo Action</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Label>
          </FormGroup>
        </div>
        <div className='col-lg-2 coursePart'>
          <FormGroup check inline className='d-flex align-items-center'>
            <div className='form-floating'>
              <select
                className='form-select dropdownBox pt-1'
                id='floatingSelect'
                aria-label='Floating label select example'
              >
                <option selected>Status</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>
          </FormGroup>
        </div>
        <div className='col-lg-2 coursePart'>
          <FormGroup check inline className='d-flex align-items-center'>
            <div className='form-floating'>
              <select
                className='form-select dropdownBox pt-1'
                id='floatingSelect'
                aria-label='Floating label select example'
              >
                <option selected>Categories</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>
          </FormGroup>
        </div>
        <div className='col-lg-2 coursePart'>
          <FormGroup check inline className='d-flex align-items-center'>
            <div className='form-floating'>
              <select
                className='form-select dropdownBox pt-1'
                id='floatingSelect'
                aria-label='Floating label select example'
              >
                <option selected>Instructor</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>
          </FormGroup>
        </div>
        <div className='col-lg-3 coursePart '>
          <FormGroup check inline className='d-flex align-items-center'>
            <div className='form-floating'>
              <select
                className='form-select dropdownBox pt-1'
                id='floatingSelect'
                aria-label='Floating label select example'
              >
                <option selected>Date Enrolled</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>
          </FormGroup>
        </div>
      </div>

      {course.map((item, i) => (
        <div
          key={i}
          className={sectionOpen == i ? 'active sectionWrap' : 'sectionWrap'}
          onClick={() => setSectionOpen(i)}
        >
          {/* innerHeading */}
          <div className='row sectionHead'>
            <div className='col-lg-3 coursePart justify-content-start'>
              <div className='d-flex py-2 align-items-center'>
                <Input type='checkbox' />
                <img src={item.thumbnail} width='80px' height='80px' className='px-3 rounded-circle' />
                <h6>{item.title}</h6>
              </div>
            </div>
            <div className='col-lg-2 coursePart'>
              <div className='py-2'>
                <h6 className='statusBox'>{item.status}</h6>
              </div>
            </div>
            <div className='col-lg-2 coursePart'>
              <div className='d-flex py-2 align-items-center'>
                <img src={imgConst.category} className='pe-2' />
                <h6>{item.category}</h6>
              </div>
            </div>
            <div className='col-lg-2 coursePart'>
              <div className='d-flex py-2 align-items-center'>
                <h6>
                  {enterprise &&
                    enterprise?.filter(item => item.createdBy == item.createdBy).map(filteredItem => filteredItem.name)}
                </h6>
              </div>
            </div>
            <div className='col-lg-3 course_action'>
              <div className='d-flex py-2 align-items-center justify-content-between px-1'>
                <h6>31 July 2022</h6>
                <h5 onClick={() => deleteCourse(item._id)}>
                  {' '}
                  <RiDeleteBin6Line />
                </h5>
                <Link href={`/student-course/?id=${item._id}`}>
                  {' '}
                  <RxEyeOpen style={{ color: '#fff' }} />
                </Link>
              </div>
            </div>
          </div>
          {/* innerContent */}
          {sectionOpen == i && (
            <div className='py-3 sectionInner'>
              <CardText style={{ lineHeight: '1.5rem', paddingBottom: '20px' }}>{item.description}</CardText>

              <hr
                style={{
                  borderTop: '1px solid white',
                  marginRight: '1450px',
                  marginLeft: '0px',
                  padding: '10px 0'
                }}
              />
              <CardText> Requirements:</CardText>
              <List>
                <li>{item.requireCourse}</li>
              </List>
              <CardText> Course Length: 8h 30min</CardText>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
