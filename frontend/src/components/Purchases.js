import Navbar from "./Navbar"
import React, { useState, useEffect } from 'react'
import Book from "./Book"
const Purchases = () => {

    const sectionClass = "flex flex-row flex-nowrap items-center w-[18.5rem] whitespace-nowrap overflow-x-auto gap-16"

    const getCurrentDimension = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
        }
        const [screenSize, setScreenSize] = useState(getCurrentDimension());
        useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
            console.log(screenSize)
        }
        window.addEventListener('resize', updateDimension);

        return(() => {
            window.removeEventListener('resize', updateDimension);
        })
        }, [screenSize])
    let bgImage = screenSize.width > 500 ? "url(./signInBanner.png)" : "url(./signInBannerMobile.png)"

  return (
    <div className="flex flex-col items-center gap-8">
        <div style={{backgroundImage: bgImage}} className='h-[16.3rem] w-full bg-contain bg-no-repeat bg-top'/>
        <div className="flex items-start px-[1.5rem] w-[98%] h-9 text-2xl font-bold">
           المشتريات
        </div>
        <div className={sectionClass}>
            <Book info={'price'} />
            <Book info={'price'} />
        </div>
        <button className="w-[15.6rem] h-9 rounded-2xl text-white bg-accent">
            الحساب : 6000 ليرة سورية
        </button>


        <Navbar cartIcon={'./icons/activeCartIcon.svg'} />
    </div>
  )
}

export default Purchases
