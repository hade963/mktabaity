import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className='flex flex-col items-center gap-6 w-full h-full'>
        <div className='flex flex-row w-full p-5 items-center justify-between text-3xl font-bold'>
            <p>الاعدادات</p>
            <Link to="/"><img src="./icons/activeHomeIcon.svg" /></Link>
        </div>

        <div className="w-[35.9%] h-[16.6%] relative">
            <div className='flex items-center justify-center w-full h-full rounded-full overflow-hidden bg-accent'>
                <img className='w-full rounded-full' src='./profilePic.png' />
            </div>
            <button  className="absolute z-10 bottom-0 right-1"><img src='./icons/cameraIcon.svg' /></button>
        </div>

        <div className='flex flex-col items-center justify-center gap-5 w-full'>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 text-white bg-nav '>
                    <p>تغيير الاسم</p>
                    <img src='./icons/arrowIcon.svg' />
                </div>
            </button>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 text-white bg-nav '>
                    <p>تغيير أو تعيين كلمة السر</p>
                    <img src='./icons/arrowIcon.svg' />
                </div>
            </button>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 text-white bg-nav '>
                    <p>الإشعارات</p>
                    <img src='./icons/arrowIcon.svg' />
                </div>
            </button>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 text-white bg-nav '>
                    <p>الخصوصية والحماية</p>
                    <img src='./icons/arrowIcon.svg' />
                </div>
            </button>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 text-white bg-nav '>
                    <p>الدعم</p>
                    <img src='./icons/arrowIcon.svg' />
                </div>
            </button>
            <button className='w-[85%]'>
                <div className='flex flex-row justify-between rounded-md p-4 font-bold text-red-700 bg-nav '>
                    <p>تسجيل الخروج</p>
                    <img src='./icons/redLogoutIcon.svg' />
                </div>
            </button>
        </div>

    </div>
  )
}

export default Settings
