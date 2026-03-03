import React from 'react';
import { formatTime } from '../utils/timeFormat';

interface VideoPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  togglePlay: () => void;
}

export const VideoPlayer = React.memo(({ isPlaying, currentTime, togglePlay }: VideoPlayerProps) => {
  return (
    <div className="flex-1 border-b border-white flex flex-col items-center justify-center p-8 bg-black relative">
      <div className="w-full max-w-4xl aspect-video border-2 border-white/20 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden group">
        {/* Video Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Central Signal Text */}
        <div className="z-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 border-2 border-white/10 rounded-full flex items-center justify-center mb-4 relative">
             <div className={`w-8 h-8 rounded-full transition-colors ${isPlaying ? 'bg-[#FF4500]/50 animate-ping' : 'bg-white/10'}`}></div>
             <div className={`absolute w-8 h-8 rounded-full ${isPlaying ? 'bg-[#FF4500]' : 'bg-white/20'}`}></div>
          </div>
          <span className="text-white/40 text-sm font-bold tracking-[0.3em] uppercase mb-2 font-mono">Camera 01</span>
          <span className="text-white/80 text-2xl font-black tracking-widest uppercase">Video Signal Input</span>
        </div>
        
        {/* Overlay Meta Data (Top Left) */}
        <div className="absolute top-4 left-4 flex flex-col font-mono text-xs text-white/50 tracking-wider space-y-1">
          <span>REC 1080p 60FPS</span>
          <span>DATA: OK</span>
        </div>

        {/* Overlay Play State (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center space-x-3 bg-black/50 px-3 py-1.5 border border-white/10 backdrop-blur-sm">
          <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,69,0,0.8)] ${isPlaying ? 'bg-[#FF4500] animate-pulse' : 'bg-white/30 shadow-none'}`}></div>
          <span className={`font-mono text-sm tracking-widest font-bold ${isPlaying ? 'text-[#FF4500]' : 'text-white/50'}`}>
            {isPlaying ? 'LIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Overlay Safe Area Guides */}
        <div className="absolute inset-4 border border-white/5 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-2 bg-white/20"></div>
          <div className="absolute bottom-0 left-1/2 w-px h-2 bg-white/20"></div>
          <div className="absolute left-0 top-1/2 h-px w-2 bg-white/20"></div>
          <div className="absolute right-0 top-1/2 h-px w-2 bg-white/20"></div>
        </div>

        {/* Progress Bar (Bottom Edge) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-[#FF4500] transition-all duration-100 ease-linear" 
            style={{ width: `${(currentTime % 60) / 60 * 100}%` }} // Loops every 60s for visual effect
          ></div>
        </div>
      </div>
      
      {/* Player Controls */}
      <div className="w-full max-w-4xl mt-6 flex items-center justify-between font-mono">
        <div className="flex space-x-4">
          <button 
            onClick={togglePlay}
            className={`border-2 px-8 py-3 uppercase font-black tracking-widest transition-all ${isPlaying ? 'border-[#FF4500] text-[#FF4500] shadow-[0_0_15px_rgba(255,69,0,0.2)]' : 'border-white text-white hover:bg-white hover:text-black'}`}
          >
            {isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          </button>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-5xl text-[#FF4500] font-black tracking-widest tabular-nums">
            {formatTime(currentTime)}
          </div>
          <span className="text-xs text-white/40 tracking-widest uppercase mt-1">Master Timecode</span>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
