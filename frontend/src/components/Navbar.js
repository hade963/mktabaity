import { Link } from 'react-router-dom';

const Navbar = (Props) => {

  return (
    <div className="flex flex-row items-center justify-between fixed bottom-3 overflow-hidden m-auto px-[2.75rem] rounded-2xl w-[22.4rem] h-[3.9rem] bg-nav">
        <Link to="/purchases"><img src={Props.cartIcon} /></Link>
        <img src={Props.searchIcon} />
        <Link to="/profile"><img src={Props.profileIcon} /></Link>
        <Link to="/"><img src={Props.homeIcon} /></Link>
    </div>
  )
}

Navbar.defaultProps = {
  homeIcon: "./icons/homeIcon.png",
  profileIcon: "./icons/profileIcon.png",
  cartIcon: "./icons/cartIcon.png",
  searchIcon: "./icons/searchIcon.png"
};

export default Navbar
