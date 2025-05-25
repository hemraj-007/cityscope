import { useEffect, useState, useCallback } from 'react';
import { getPosts, reactToPost, createReply } from '../services/api';
import toast from 'react-hot-toast';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface Post {
    id: number;
    text: string;
    type: string;
    location: string;
    likes: number;
    dislikes: number;
    user: { username: string };
    createdAt: string;
    replies: { id: number; text: string; user: { username: string } }[];
    userReaction?: 'like' | 'dislike' | null; // NEW field for frontend
}


const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyLoading, setReplyLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [activeReply, setActiveReply] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPosts(locationFilter, typeFilter);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [locationFilter, typeFilter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleReaction = async (postId: number, reaction: 'like' | 'dislike') => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in');
            return;
        }

        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        // Prevent duplicate reaction
        if (post.userReaction === reaction) {
            toast.error(`You already ${reaction}d this post`);
            return;
        }

        try {
            await reactToPost(token, postId, reaction);
            toast.success(`Post ${reaction}d!`);

            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== postId) return p;

                    let likes = p.likes;
                    let dislikes = p.dislikes;

                    if (reaction === 'like') {
                        if (p.userReaction === 'dislike') dislikes -= 1;
                        likes += 1;
                    } else if (reaction === 'dislike') {
                        if (p.userReaction === 'like') likes -= 1;
                        dislikes += 1;
                    }

                    return { ...p, likes, dislikes, userReaction: reaction };
                })
            );
        } catch (err) {
            console.error(err);
            toast.error('Failed to react to post');
        }
    };

    const handleReply = async (postId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in');
            return;
        }

        if (!replyText.trim()) {
            toast.error('Reply cannot be empty');
            return;
        }

        try {
            setReplyLoading(true);
            await createReply(token, postId, replyText);
            toast.success('Reply posted!');
            setReplyText('');
            setActiveReply(null);
            fetchPosts();
        } catch (err) {
            console.error(err);
            toast.error('Failed to post reply');
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Cityscope Feed</h1>

                {/* Filter Bar */}
                <div className="flex gap-4 mb-4">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="recommend">Recommend</option>
                        <option value="help">Help</option>
                        <option value="update">Update</option>
                        <option value="event">Event</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                </div>

                {/* Loader */}
                {loading && <p className="text-sm text-gray-500 mb-4">Searching...</p>}

                {/* No Posts */}
                {!loading && posts.length === 0 && (
                    <p className="text-gray-600">No posts found</p>
                )}

                {/* Posts */}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 bg-white shadow-lg rounded-xl transition hover:shadow-xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">
                                    {post.user.username} • {new Date(post.createdAt).toLocaleString()}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">{post.type}</span>
                            </div>

                            <p className="mb-2 text-gray-800">{post.text}</p>

                            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                                <span>📍 {post.location}</span>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleReaction(post.id, 'like')}
                                        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
                                    >
                                        <ThumbsUp size={18} /> {post.likes}
                                    </button>
                                    <button
                                        onClick={() => handleReaction(post.id, 'dislike')}
                                        className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition"
                                    >
                                        <ThumbsDown size={18} /> {post.dislikes}
                                    </button>
                                    <button
                                        onClick={() => setActiveReply(post.id)}
                                        className="flex items-center gap-1 text-gray-700 hover:text-gray-800 transition"
                                    >
                                        <MessageCircle size={18} /> Reply
                                    </button>
                                </div>
                            </div>

                            {/* Replies */}
                            {post.replies?.length > 0 && (
                                <div className="mt-4 border-t border-gray-200 pt-2 space-y-2">
                                    {post.replies.map((reply) => (
                                        <div key={reply.id} className="text-sm text-gray-700 bg-gray-100 rounded p-2">
                                            <span className="font-semibold">{reply.user.username}</span>: {reply.text}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Input */}
                            {activeReply === post.id && (
                                <div className="mt-3 relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full p-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                    <button
                                        onClick={() => handleReply(post.id)}
                                        disabled={replyLoading}
                                        className={`absolute right-2 px-4 py-1 bg-gray-700 text-white rounded-lg text-sm ${replyLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                            }`}
                                    >
                                        {replyLoading ? 'Posting...' : 'Reply'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;
