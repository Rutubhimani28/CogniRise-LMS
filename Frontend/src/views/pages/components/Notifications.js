import React from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardSubtitle, CardText } from 'reactstrap'

// ** Images
import imgConst from 'src/configs/imgConst'

const NotificationsData = [
  {
    icon: '',
    title: 'BNB Tumbled today',
    desc: 'Today, 16:36, CoinTelegraph',
    price: 'BNB -1.0%'
  },
  {
    icon: imgConst.Events,
    title: 'Event Scheduled',
    desc: '23 Jun, 13:06, ETH Denver',
    price: 'Book Tickets'
  },
  {
    icon: imgConst.newCourse,
    title: 'New Course Released',
    desc: '21 Jun, 19:04, CogniRise',
    price: 'Enroll'
  }
]

export default function Notifications() {
  return (
    <div className='learnningTimeBox'>
      <h2 className='fs-5 fw-bold'>Notifications</h2>
      <CardText className='pt-2'>Recent</CardText>
      <div>
        {NotificationsData.map((item, i) => (
          <div key={i} className='d-flex justify-content-between align-items-center py-3'>
            <div className='my-1  d-flex '>
              <div className='notificationIconBox me-2'>
                <img src={item.icon} />
              </div>
              <div>
                <h6>{item.title}</h6>
                <CardText style={{ fontSize: '12px' }}>{item.desc}</CardText>
              </div>
            </div>
            <CardSubtitle>{item.price}</CardSubtitle>
          </div>
        ))}
      </div>
      <h6 className='text-end pt-3' style={{ color: '#6282F0', cursor: 'pointer' }}>
        View all
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}
