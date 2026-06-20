import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Loader2 } from 'lucide-react';

const EpisodeUploader = ({ podcastId, token, onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    const handlePublish = async (e) => {
        e.preventDefault();
        if (!podcastId) return;
        
        setIsUploading(true);
        try {
            // Mocking the media upload by using a fake audio URL
            const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            
            const response = await fetch(`/api/podcasts/${podcastId}/episodes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    audio_url: audioUrl,
                    duration_seconds: 360
                })
            });
            
            if (response.ok) {
                const ep = await response.json();
                if (onUploadSuccess) onUploadSuccess(ep);
                setTitle('');
                setDescription('');
            }
        } catch (err) {
            console.error("Failed to upload episode", err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">
            <h3 className="text-xl font-bold mb-4">Upload New Episode</h3>
            {!podcastId ? (
                <div className="text-gray-500">Please select a podcast to upload episodes to.</div>
            ) : (
                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition">
                        <UploadCloud size={48} className="text-blue-500 mb-4" />
                        <p className="font-bold">Select Audio File</p>
                        <p className="text-sm text-gray-500">MP3, M4A up to 200MB</p>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Episode Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Show Notes</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" disabled={isUploading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center transition">
                        {isUploading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" size={18} />}
                        {isUploading ? 'Publishing...' : 'Publish Episode'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EpisodeUploader;
