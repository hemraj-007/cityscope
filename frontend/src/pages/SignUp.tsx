import { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', password: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signup(formData.username, formData.password, formData.bio);
      localStorage.setItem('token', res.data.token);
      toast.success('Signup successful!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="relative w-80 sm:w-96">
        {/* Grey Tilted Background Card */}
        <div className="absolute inset-0 bg-gray-400 rounded-lg -rotate-6 shadow-xl w-full h-full"></div>

        {/* White Foreground Form */}
        <form onSubmit={handleSubmit} className="relative z-10 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Create an account to join Cityscope</p>

          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            name="bio"
            placeholder="Enter Your Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account? <a href="/signin" className="text-blue-600 font-semibold hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
