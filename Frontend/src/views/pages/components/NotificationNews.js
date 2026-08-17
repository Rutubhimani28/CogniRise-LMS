import React from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'

const NotificationsData = [
  {
    icon: '',
    title: 'BNB Tumbled Today',
    desc: 'Today, 16:36, CoinTelegraph'
  },
  {
    icon: '',
    title: 'Event Scheduled',
    desc: '23 Jun, 13:06, ETH Denver'
  },
  {
    icon: '',
    title: 'New Course Released',
    desc: '21 Jun, 19:04, CogniRise'
  }
]

export default function NotificationNews() {
  return (
    <div className='learnningTimeBox'>
      <h2 className='fw-bold' style={{ fontSize: '20px' }}>
        Notifications/News
      </h2>
      <CardText className='pt-2'>Recent</CardText>
      <div>
        {NotificationsData.map((item, i) => (
          <div key={i}>
            <div className=' py-3 d-flex'>
              <div className='notificationIconBox me-3'>
                <img src={item.icon} />
              </div>
              <div>
                <h6 style={{ fontSize: '14px' }}>{item.title}</h6>
                <CardText style={{ fontSize: '12px' }}>{item.desc}</CardText>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h6 className='text-end pt-1' style={{ color: '#6282F0', cursor: 'pointer' }}>
        View all
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}
