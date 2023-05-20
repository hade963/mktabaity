import Book from "./Book"
import MainBook from "./MainBook"
import Navbar from "./Navbar"

const Home = () => {

    const sectionClass = "flex flex-row flex-nowrap items-center w-full whitespace-nowrap overflow-x-auto gap-2"
    const typesClass = "inline-block flex-shrink-0 py-2 text-center text-xl text-accent focus:text-white focus:bg-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl"
    const activeTypeClass = "inline-block flex-shrink-0 py-2 text-center text-xl text-white w-[5.25rem] h-[3.125rem] rounded-3xl bg-accent"

  return (
    <div className="flex flex-col items-center gap-3">

        <div className='flex flex-row w-full px-5 items-center justify-start text-accent text-3xl font-bold'>
            <img src="./icons/logo.svg" />
        </div>

        <div className={sectionClass}>
            <button className={typesClass}>
                الكل
            </button>
            <button className={typesClass}>
                علمية
            </button>
            <button className={typesClass}>
                تقنية
            </button>
            <button className={typesClass}>
                أدبية
            </button>
            <button className={typesClass}>
                فلسفية
            </button>
        </div>
        <div className={sectionClass}>
            <MainBook />
            <MainBook />
            <MainBook />
            <MainBook />
            <MainBook />
        </div>
        <div className="ps-2 text-start w-full h-8 font-bold text-accent text-xl">
            الكتب الموصى بها
        </div>
        <div className={sectionClass}>
            <Book info={'author'} />
            <Book info={'author'} />
            <Book info={'author'} />
            <Book info={'author'} />
        </div>
        <Navbar homeIcon={"./icons/activeHomeIcon.svg"} />
    </div>
  )
}

export default Home
