import React, { useState, useEffect } from 'react';
import { PlusCircle, Link, Copy, CheckCircle, Upload } from 'lucide-react';

const PodcastManager = ({ userId, token, onSelectPodcast }) => {
    const [podcasts, setPodcasts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Education');
    const [copiedId, setCopiedId] = useState(null);

    // In a real app, we would fetch existing podcasts here
    useEffect(() => {
        // Fetch podcasts
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/podcasts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title, description, category, 
                    cover_image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=200' 
                })
            });
            if (response.ok) {
                const newPodcast = await response.json();
                setPodcasts([...podcasts, newPodcast]);
                setIsCreating(false);
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const copyRssUrl = (id) => {
        const url = `${window.location.origin}/api/podcasts/${id}/rss`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Your Podcasts</h2>
                    <p className="text-gray-500">Manage your premium audio feeds</p>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center hover:bg-blue-700 transition"
                >
                    <PlusCircle size={18} className="mr-2" />
                    New Podcast
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold mb-4">Create New Podcast</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} required className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500" rows="3"></textarea>
                        </div>
                        <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800">
                            Create Podcast
                        </button>
                    </div>
                </form>
            )}

            {podcasts.length === 0 && !isCreating && (
                <div className="text-center py-12 text-gray-500">
                    You haven't created any podcasts yet.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {podcasts.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500 cursor-pointer transition" onClick={() => onSelectPodcast && onSelectPodcast(p)}>
                        <div>
                            <h4 className="font-bold text-lg">{p.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => copyRssUrl(p.id)}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center transition"
                            >
                                {copiedId === p.id ? <CheckCircle size={16} className="mr-2 text-green-500"/> : <Link size={16} className="mr-2"/>}
                                {copiedId === p.id ? 'Copied RSS URL' : 'Copy Public RSS URL'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PodcastManager;
