import React from 'react'
import imgs from '../assets/st. peter.jpeg'

const Nav = () => {
  return (
    <div className='w-screen text-center pb-2 fixed top-0 h-8 bg-slate-100'>
      <div className='flex items-center justify-center gap-1'>
        <img src={imgs} alt=""  className='rounded-full h-8 w-8'/>
        <h2>St. Peter Parking</h2>

      </div>
        <div>
        </div>
    </div>
  )
}

export default Nav