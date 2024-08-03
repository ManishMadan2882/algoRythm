import React from 'react'
import logo from '../assets/logo.png'
const Navbar = () => {
  return (
    <div>
        <nav className='bg-raisin-black shadow-sm rounded-lg s p-0.5'>
           <div className='text-white'>
              <img width={34} className='rounded-full inline mx-4' src={logo}/>
              <span >algoRythm</span>
           </div> 
        </nav>
    </div>
  )
}

export default Navbar