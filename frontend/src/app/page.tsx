'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Download, Loader2, PlayCircle, AlertCircle } from 'lucide-react';

interface VideoFormat {
    itag: number;
    qualityLabel: string;
    container: string;
    hasAudio: boolean;
    hasVideo: boolean;
}

interface VideoInfo {
    title: string;
    thumbnail: string;
    author: string;
    lengthSeconds: string;
}

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [formats, setFormats] = useState<VideoFormat[]>([]);
    const [error, setError] = useState('');

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setVideoInfo(null);
        setFormats([]);

        try {
            const response = await fetch('http://localhost:4000/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch video info');
            }

            const data = await response.json();
            setVideoInfo(data.videoDetails);
            setFormats(data.formats);
        } catch (err) {
            setError('Could not fetch video. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (itag: number, title: string, container: string) => {
        // Initiate download by navigating to the backend download endpoint
        window.location.href = `http://localhost:4000/api/download?url=${encodeURIComponent(url)}&itag=${itag}`;
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black pb-20">
            <Navbar />

            <div className="pt-32 px-4 container mx-auto flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mb-12 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Download YouTube Videos
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Paste your link below to download high-quality videos instantly.
                    </p>

                    <form onSubmit={handleFetch} className="relative w-full max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Paste YouTube URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl pl-14 pr-32 py-5 rounded-full text-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Start'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-slide-up">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {videoInfo && (
                    <div className="w-full max-w-4xl animate-slide-up">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl p-8 rounded-3xl md:flex gap-8 items-start">
                            {/* Thumbnail */}
                            <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden relative shadow-2xl group">
                                <img
                                    src={videoInfo.thumbnail}
                                    alt={videoInfo.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
                                </div>
                            </div>

                            {/* Info & Options */}
                            <div className="w-full md:w-1/2 mt-6 md:mt-0 flex flex-col gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white line-clamp-2 leading-tight mb-2">
                                        {videoInfo.title}
                                    </h2>
                                    <p className="text-gray-400 font-medium flex items-center gap-2">
                                        By {videoInfo.author} • {Math.floor(parseInt(videoInfo.lengthSeconds) / 60)}:{String(parseInt(videoInfo.lengthSeconds) % 60).padStart(2, '0')}
                                    </p>
                                </div>

                                <div className="border-t border-white/10 my-2"></div>

                                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Available Qualities</h3>

                                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {formats.map((format, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleDownload(format.itag, videoInfo.title, format.container)}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${format.hasVideo ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {format.hasVideo ? 'V' : 'A'}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-white">{format.qualityLabel || 'Audio Only'}</p>
                                                    <p className="text-xs text-gray-500 uppercase">{format.container}</p>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
