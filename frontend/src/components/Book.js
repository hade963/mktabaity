import React from 'react'

const Book = () => {
  return (
    <div className='flex flex-col items-center gap-2 rounded-2xl w-[7.25rem] h-[12.12rem] bg-card'>
        <div className='rounded-2xl w-[7.25rem] h-[7.25rem]'>
            <img src='./bookCover.png' className='w-full' />
        </div>
        
        <div className='w-[4.2rem] h-[0.87rem] bg-yellow-200'></div>

        <div className='flex flex-col items-center text-center text-xs font-semibold w-full h-[2rem]'>
            <div>
            اسم الكتاب
            </div>
            <div>
            المؤلف
            </div>
        </div>
    </div>
  )
}

export default Book
