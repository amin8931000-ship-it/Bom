
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center transform rotate-45 red-glow">
            <span className="text-white font-bold -rotate-45 text-xl">C</span>
          </div>
          <h1 className="font-brand text-2xl tracking-tighter text-white">
            CRIMSON<span className="text-red-600">LENS</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-red-500 transition-colors">Features</a>
          <a href="#" className="text-sm font-medium hover:text-red-500 transition-colors">Gallery</a>
          <a href="#" className="text-sm font-medium hover:text-red-500 transition-colors">Pricing</a>
          <button className="px-5 py-2 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-300">
            Enterprise
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
