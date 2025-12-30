import { Youtube } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Youtube className="w-8 h-8 text-red-500" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">YT Downloader</span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-gray-300 font-medium">
                    <a href="#" className="hover:text-white transition-colors">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">About</a>
                </div>
            </div>
        </nav>
    );
}
