import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'
import Requests from 'src/configs/axiosRequest'

export default function LessoinDraft() {
  const [allCourse, setAllCourse] = useState([])
  const requestApiData = new Requests()

  useEffect(() => {
    const { id } = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData
      .TotalCouses({ createdBy: id })
      .then(res => {
        if (res?.status === 200) {
          setAllCourse(res?.data && res.data.filter(item => item.status === 'draft'))
        }
      })
      .catch(err => {
        console.log('Error on Get Enroll Course', err)
      })
  }, [])

  return (
    <div className='learnningTimeBox2 LessoinDraftwrap'>
      <div style={{ minHeight: '295.57px' }}>
        <h2
          className='fs-2 fw-bold pb-2'
          style={{
            // color: '#3A5BCD'
            // color:"#64748b"
            color: " #7d9b17"
          }}
        >
          Lesson Drafts
        </h2>
        <div>
          {allCourse?.slice(0, 3).map((item, i) => (
            <div key={i} className='my-3 ps-3 pt-1' style={{ borderLeft: '4px solid  #3A5BCD' }}>
              <h6 style={{ color: 'black' }}>{item.title}</h6>
              <CardText style={{ fontSize: '12px', color: 'black' }}>
                {item?.modules?.[item?.modules?.length - 1]?.items?.[
                  item?.modules?.[item?.modules?.length - 1]?.items?.length - 1
                ]?.id ? `${item?.modules?.[item?.modules?.length - 1]?.items?.[
                  item?.modules?.[item?.modules?.length - 1]?.items?.length - 1
                ]?.id
                } : ${item?.modules?.[item?.modules?.length - 1]?.items?.[
                  item?.modules?.[item?.modules?.length - 1]?.items?.length - 1
                ]?.name
                }` : 'No items yet'}
              </CardText>
            </div>
          ))}
        </div>
      </div>
      <h6 className='text-end' style={{ color: 'black', cursor: 'pointer' }}>
        {/* <Link href='/enterprise-courses' style={{ textDecoration: 'none', color: '#6282F0' }}>
          View Drafts
        </Link> */}
        <Link
          href={{
            pathname: '/enterprise-courses',
            query: { from: 'drafts' } // or any custom state
          }}
          style={{ textDecoration: 'none', color: '#3A5BCD' }}
        >
          View Drafts
        </Link>
        <HiArrowNarrowRight className='ms-1' style={{ color: '#3A5BCD' }} />
      </h6>
    </div>
  )
}

