import React, { useState, useEffect } from 'react'

const SignIn = () => {
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

  let inputGroupClass = 'flex flex-col items-center gap-1 rounded-sm w-[98%] h-[4.75rem]'
  let inputLabelClass = 'w-full p-1 text-sm'
  let inputClass = 'flex flex-row items-center gap-3 rounded-2xl text-sm bg-white h-[2.25rem] w-full'

  return (
    <>t
      <div style={{backgroundImage: bgImage}} className='h-[16.3rem] w-full bg-contain bg-no-repeat bg-top'/>
      <div className='flex flex-col jusify-start items-centerw-full gap-1 h-[35.3rem] p-1 m-2'>
        <div className='flex items-center w-[98%] h-[2.25rem] text-base font-semibold'>تسجيل الدخول</div>
        <div className={inputGroupClass}>
          <div className={inputLabelClass}>البريد الالكتروني<span className='text-red-700'>*</span></div>
          <input className={inputClass} />
        </div>
        <div className={inputGroupClass}>
          <div className={inputLabelClass}>كلمة المرور<span className='text-red-700'>*</span></div>
          <input className={inputClass} />
        </div>
        <div className='flex flex-row justify-start items-center w-[98%] text-xs gap-3 h-[2.25rem]'>
          <input className='w-[1.2rem] h-[1.2rem]' type='checkbox' />
          تذكرني
        </div>
        <div className='flex flex-col justify-center items-center w-[98%] h-[2.25rem]'>
          <button className='w-full h-full rounded-2xl px-1 py-0 text-white text-base font-semibold bg-accent'>سجل الدخول</button>
        </div>
        <div className='flex flex-row justify-center items-center text-sm font-semibold w-[98%] h-[2.25rem]'> هل نسيت كلمة السر ؟ <a href='#' className='text-accent mr-1'> استعدها</a></div>
        <div className='flex flex-row items-center text-sm w-[98%] h-[1.5rem]'>أو عبر حسابك على</div>
        <div className='flex flex-row justify-between items-center w-[98%] h-[2.25rem]'>
          <a href='#'><img src='./facebookIcon.png' /></a>
          <a href='#'><img src='./googleIcon.png' /></a>
          <a href='#'><img src='./appleIcon.png' /></a>
        </div>
        <div className='flex flex-row justify-center items-center text-sm w-[98%] h-[2.25rem]'>ليس لديك حساب ؟ <a href='#' className='text-accent mr-1'>أنشئ حساب</a></div>
      </div>
    </>
  )  
}

export default SignIn
