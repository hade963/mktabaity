import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Purchases from './components/Purchases';
import Profile from './components/Profile';
import Settings from './components/Settings';
import BookDetails from './components/BookDetails';

function App() {
  return (
    <div dir='rtl' className='min-h-screen bg-main'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="settings" element={<Settings />} />
        <Route path="details" element={<BookDetails />} />
      </Routes>
    </div>
  );
}

export default App;
