import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, MessagesSquare } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 p-6 relative overflow-hidden">
      
      {/* Blurred Background Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gray-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-gray-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/2 w-60 h-60 bg-gray-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 z-10">
        Your community, your voice.
      </h1>
      <p className="text-lg sm:text-xl text-center max-w-md mb-8 text-gray-600 z-10">
        Cityscope is where your local stories come alive. Connect, share, and stay informed.
      </p>

      <div className="flex gap-6 z-10 mb-8">
        <a href="/signin" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
          Sign In
        </a>
        <a href="/signup" className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
          Sign Up
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl z-10 text-center">
        <FeatureCard icon={<MapPin size={32} />} title="Discover" text="Find what's happening in your area." />
        <FeatureCard icon={<Sparkles size={32} />} title="Share" text="Post updates, events, and recommendations." />
        <FeatureCard icon={<MessagesSquare size={32} />} title="Connect" text="Engage with your neighbors and community." />
      </div>

      <div className="mt-12 text-sm text-gray-500 z-10">
        <p>Built with ❤️ for your neighborhood</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }: { icon: ReactNode; title: string; text: string }) => {
  return (
    <div className="p-4 bg-white/70 rounded-lg shadow hover:shadow-md transition">
      <div className="text-blue-600 mb-2">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default Home;
