import { Link } from 'react-router-dom';

const MainBook = () => {
  return (
    <Link to="/details" >
      <div className='flex flex-col items-center gap-2 rounded-2xl w-[11rem] h-[18.25rem] bg-card'>
          <div className='rounded-2xl w-[11rem] h-[12rem]'>
              <img src='./mainBookCover.png' className='w-full' />
          </div>
          
          <div className='w-[4.2rem] h-[0.87rem] bg-yellow-200'></div>

          <div className='flex flex-col items-start ps-3 text-xs w-full h-[2rem]'>
              <div className='font-semibold'>
              اسم الكتاب
              </div>
              <div>
              المؤلف
              </div>
              <div>
                  3000 ليرة سورية
              </div>
          </div>
      </div>
    </Link>
  )
}

export default MainBook
