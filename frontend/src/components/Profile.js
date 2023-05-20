import Navbar from "./Navbar"
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const Profile = () => {

  const [show, setShow] = useState(true)
  const [details, setdetails] = useState('about')

  const blurBackground = () => {
    setShow(prevShow => !prevShow)
  }
  const changeSection = (e) => {
    setdetails(e)
  }

  return (
    <div className='flex flex-col items-center gap-5 w-full h-full'>
        <div className='flex flex-row justify-between items-center h-[4.75rem] w-full px-4'>
            <div className='flex flex-row gap-2'>
                <div className="relative inline-block">
                  <button onClick={blurBackground} ><img className='w-6 h-6' src='./icons/optionsIcon.svg'/></button>
                  {!show ? (
                  <div className="flex flex-col divide-y-2 absolute w-44 z-10 text-xs rounded-2xl bg-nav">
                    <button className="w-full text-start py-1 ps-4">مساعدة</button>
                    <button className="w-full text-start py-1 ps-4">تواصل معنا</button>   
                  </div>) : <></> }

                </div>
                <Link to="/settings"><button><img className='w-6 h-6' src='./icons/settingIcon.svg'/></button></Link>
                <button><img className='w-6 h-6' src='./icons/logoutIcon.svg'/></button>
            </div>
            <img className='w-[5.5rem]' src='./icons/logo.svg'/>
        </div>


          <div className={`${!show ? 'blur-sm overflow-hidden transition duration-20 ' : ''}flex items-center w-[35.9%] h-[16.6%] justify-center rounded-full overflow-hidden bg-accent`}>
              <img className='w-full rounded-full' src='./profilePic.png' />
          </div>


        <div className={`${!show ? 'blur-sm overflow-hidden transition duration-20' : ''} flex flex-col items-center justify-center text-center gap-1 font-medium`}>
          <p>راني اسماعيل</p>
          <p>سوريا - طرطوس</p>
          <p dir='ltr'>+963 938 254 851</p>
        </div>

        <div className={`${!show ? 'blur-sm overflow-hidden transition duration-20' : ''} flex felx-row gap-3 items-center justify-center text-center`}>
          <div className='flex flex-col items-center justify-center' >
            <img className='w-6 h-6' src='./icons/cartIcon.svg'/>
            15
          </div>
          <div className='flex flex-col items-center justify-center' >
            <img className='w-6 h-6' src='./icons/calculatorIcon.svg'/>
            64000
          </div>
          <div className='flex flex-col items-center justify-center' >
            <img className='w-6 h-6' src='./icons/heartIcon.svg'/>
            255
          </div>
        </div>

        <div className={`${!show ? 'blur-sm overflow-hidden transition duration-20' : ''} w-full h-56 rounded-3xl text-white bg-nav`}>
          <div className='flex flex-row flex-nowrap items-center w-full text-lg whitespace-nowrap overflow-x-auto'>
            <button onClick={e => changeSection(e.target.value)} value='about' className='border-b-4 border-accent text-accent p-2 font-bold w-full'>حول</button>
            <button onClick={e => changeSection(e.target.value)} value='hobbies' className='border-b-2 p-2 font-bold w-full'>الهوايات</button>
            <button onClick={e => changeSection(e.target.value)} value='interested' className='border-b-2 p-2 font-bold w-full'>الاهتمامات</button>
          </div>
          <div className="p-2">
              {
                details === 'about' ? 'صفحة حول المستخدم' :
                details === 'hobbies' ? 'صفحة هوايات المتستخدم' : 
                details === 'interested' ? "صفحة اهتمامات المستخدم" : ''
              }
          </div>
        </div>

        <Navbar profileIcon={'./icons/activeProfileIcon.svg'} />
    </div>
  )
}

export default Profile
