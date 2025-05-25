import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getUserProfile(decoded.userId);
        setUsername(res.data.username);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-md shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
      <h1
        className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-300"
        onClick={() => navigate('/feed')}
      >
        Cityscope
      </h1>

      <div className="flex gap-6 items-center">
        <button onClick={() => navigate('/feed')} className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
          Feed
        </button>
        <button onClick={() => navigate('/create-post')} className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
          Create Post
        </button>
        <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline transition">
          Logout
        </button>

        {/* Avatar Profile Icon */}
        <div
          className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold text-sm cursor-pointer hover:scale-105 transition"
          onClick={() => navigate('/profile')}
        >
          {username ? username[0].toUpperCase() : 'U'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
