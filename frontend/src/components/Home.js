import Book from "./Book"
import MainBook from "./MainBook"
import Navbar from "./Navbar"

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-3 pt-[7.2rem]">
        <div className="flex flex-row flex-nowrap items-center w-full whitespace-nowrap overflow-x-auto gap-2">
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-white w-[5.25rem] h-[3.125rem] rounded-3xl bg-accent">
                الكل
            </div>
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl">
                علمية
            </div>
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl">
                تقنية
            </div>
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl">
                أدبية
            </div>
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl">
                فلسفية
            </div>
            <div className="inline-block flex-shrink-0 py-2 text-center text-xl text-accent bg-white w-[5.25rem] h-[3.125rem] border-2 border-accent rounded-3xl">
                فلسفية
            </div>
        </div>
        <div className="flex flex-row flex-nowrap items-center w-full whitespace-nowrap overflow-x-auto gap-2">
            <MainBook />
            <MainBook />
            <MainBook />
            <MainBook />
            <MainBook />
        </div>
        <div className="ps-2 text-start w-full h-[1.8rem] font-bold text-accent text-xl">
            الكتب الموصى بها
        </div>
        <div className="flex flex-row flex-nowrap items-center w-full whitespace-nowrap overflow-x-auto gap-2">
            <Book />
            <Book />
            <Book />
            <Book />
        </div>
        <Navbar />
    </div>
  )
}

export default Home
