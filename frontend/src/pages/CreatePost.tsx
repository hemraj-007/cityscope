import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getUserProfile } from '../services/api';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
}


const CreatePost = () => {
  const [formData, setFormData] = useState({ text: '', type: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.userId;
        const res = await getUserProfile(userId);
        setUsername(res.data.username);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsername();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to create a post');
      return;
    }

    try {
      setLoading(true);
      await createPost(token, formData.text, formData.type, formData.location);
      toast.success('Post created!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4 relative overflow-hidden">
      
      {/* Blurred Background Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gray-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-gray-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/2 w-60 h-60 bg-gray-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 transform transition-all duration-500 hover:scale-105"
      >
        {/* Avatar and Username */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-lg">
            {username ? username[0].toUpperCase() : 'H'}
          </div>
          <span className="ml-3 text-gray-700 font-semibold">{username || 'YourUsername'}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 text-center">What's on your mind today?</h2>

        <textarea
          name="text"
          placeholder="Write your thoughts..."
          value={formData.text}
          onChange={handleChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none h-24"
          required
        ></textarea>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          required
        >
          <option value="">Select Type</option>
          <option value="recommend">Recommend</option>
          <option value="help">Help</option>
          <option value="update">Update</option>
          <option value="event">Event</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
