import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import toast from 'react-hot-toast';

interface DecodedToken {
  userId: number;
}

const UserProfile = () => {
  const [user, setUser] = useState<{ username: string; bio: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        navigate('/signin');
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getUserProfile(decoded.userId);
        setUser(res.data);
        setUsername(res.data.username);
        setBio(res.data.bio || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login');
      return;
    }

    try {
      setLoading(true);
      const decoded = jwtDecode<DecodedToken>(token);
      await updateUserProfile(token, decoded.userId, username, bio);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>

        {editMode ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              placeholder="Your bio"
            ></textarea>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p className="mt-2"><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
