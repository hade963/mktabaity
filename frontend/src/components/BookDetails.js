import Navbar from "./Navbar"

const BookDetails = () => {
  return (
    <div className='flex flex-col gap-4 justify-start items-center'>
      <img src='./icons/bigLogo.svg' />
      <div className='flex flex-row w-full'>
        <div className='flex flex-col items-center justify-start gap-4 w-1/2'>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
                اسم الكتاب
            </div>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
                اسم الكاتب
            </div>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
               المنطقة
            </div>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
                الوصف 
            </div>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
                التقييم 
            </div>
            <div className='w-5/6 h-12 text-base p-3 font-medium text-center rounded-2xl text-accent bg-white'>
                 السعر
            </div>
        </div>

        <div className='flex flex-col items-center gap-4 justify-start w-1/2'>
            <div className='w-40 h-40 rounded-xl mb-6 bg-nav'></div>
            <p dir='ltr' className='font-semibold'>follow rani on:</p>
            <p dir='ltr' className='flex flex-row gap-2 justify-center items-center'><img src='./icons/facebookIcon.svg' /><a>@raniismail</a></p>
            <p dir='ltr' className='flex flex-row gap-2 justify-center items-center'><img src='./icons/linkedinIcon.svg' /><a>@raniismail</a></p>
            <p dir='ltr' className='flex flex-row gap-2 justify-center items-center'><img src='./icons/twitterIcon.svg' /><a>@raniismail</a></p>
        </div>
      </div>

      <Navbar homeIcon={"./icons/activeHomeIcon.svg"} />
    </div>
  )
}

export default BookDetails
