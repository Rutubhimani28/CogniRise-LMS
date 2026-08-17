import React from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { CardText } from 'reactstrap'

const list = [
  {
    title: 'Launch Test NFT',
    desc: 'Blockchain 102: NFTs'
  },
  {
    title: 'Complete Quiz',
    desc: 'DeFi 203: What is Yield?'
  },
  {
    title: 'Mint Certificate',
    desc: 'Community 101: '
  }
]

export default function ToDoList() {
  return (
    <div className='learnningTimeBox'>
      <h2 className=' fw-bold pb-3' style={{ fontSize: '34px' }}>
        To-Do List
      </h2>
      <div>
        {list.map((item, i) => (
          <div key={i} className='my-2 ps-2' style={{ borderLeft: '4px solid  #0066FF', margin: '10px 0' }}>
            <h6>{item.title}</h6>
            <CardText style={{ fontSize: '12px', marginBottom: '20px' }}>{item.desc}</CardText>
          </div>
        ))}
      </div>
      <h6 className='text-end ' style={{ color: '#6282F0', cursor: 'pointer' }}>
        View all Tasks
        <HiArrowNarrowRight className='ms-1' />
      </h6>
    </div>
  )
}
