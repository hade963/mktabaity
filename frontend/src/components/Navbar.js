import React from 'react'

const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between px-[2.75rem] rounded-2xl w-[22.4rem] h-[3.9rem] bg-nav">
        <img src="./cartIcon.png" />
        <img src="./searchIcon.png" />
        <img src="./profileIcon.png" />
        <img src="./homeIcon.png" />
    </div>
  )
}

export default Navbar
