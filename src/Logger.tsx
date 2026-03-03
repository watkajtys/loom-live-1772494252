import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: number;
  tag: string;
  key: string;
}

const formatTime = (seconds: number) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${pad(m)}:${pad(s)}:${pad(ms)}`;
};

export default function Logger() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const TAG_SCHEMA = [
    { key: '1', label: 'Play Action' },
    { key: '2', label: 'Foul' },
    { key: '3', label: 'Goal' },
    { key: '4', label: 'Substitution' },
  ];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        return;
      }

      const matchingSchema = TAG_SCHEMA.find(schema => schema.key === e.key);
      if (matchingSchema) {
        setEvents(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            timestamp: currentTime,
            tag: matchingSchema.label,
            key: matchingSchema.key
          }
        ]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, isPlaying]);

  const exportCSV = () => {
    const headers = ['Timestamp', 'Key', 'Tag'];
    const rows = events.map(e => [formatTime(e.timestamp), e.key, e.tag]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'warp_logger_events.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase">Warp Logger</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={exportCSV}
            className="flex items-center space-x-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase font-bold text-sm"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col border-r border-white">
          
          {/* Video Player Mock */}
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
                  onClick={() => setIsPlaying(!isPlaying)}
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

          {/* Timeline */}
          <div className="h-64 p-4 flex flex-col bg-black">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70 font-sans">Timeline</h2>
            <div className="flex-1 border-2 border-white/20 relative overflow-hidden bg-zinc-950">
              {/* Playhead */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-[#FF4500] shadow-[0_0_10px_rgba(255,69,0,0.8)] z-20 left-1/2">
                <div className="absolute top-0 -translate-x-1/2 w-4 h-4 bg-[#FF4500] flex items-center justify-center">
                   <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10%_100%] pointer-events-none"></div>
              
              {/* Tracks */}
              <div className="absolute inset-0 flex flex-col justify-around py-4 z-10">
                {TAG_SCHEMA.map(schema => (
                  <div key={schema.key} className="h-6 border-b border-white/10 relative w-full group hover:bg-white/5 transition-colors">
                    <span className="absolute left-2 top-1 text-[10px] text-white/30 font-mono tracking-widest uppercase group-hover:text-white/70 transition-colors">{schema.label}</span>
                    {/* Event markers would go here */}
                    {events.filter(e => e.tag === schema.label).map(e => {
                      // Mock positioning based on time relative to playhead (assuming 10s window for viz)
                      const timeDiff = e.timestamp - currentTime;
                      const leftPos = `calc(50% + ${timeDiff * 10}%)`;
                      return Math.abs(timeDiff) < 5 ? (
                        <div key={e.id} className="absolute top-0 bottom-0 w-1.5 bg-[#FF4500] shadow-[0_0_5px_rgba(255,69,0,0.5)] cursor-pointer hover:bg-white hover:scale-x-150 transition-all origin-center" style={{ left: leftPos }}></div>
                      ) : null;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 flex flex-col bg-black">
          {/* Tag Schema */}
          <div className="p-4 border-b border-white">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70 font-sans">Tag Schema</h2>
            <div className="space-y-3">
              {TAG_SCHEMA.map(schema => (
                <div key={schema.key} className="flex justify-between items-center border border-white/20 p-3 text-sm font-mono bg-zinc-950 hover:border-white/50 transition-colors group">
                  <span className="text-white/80 uppercase font-bold tracking-wider">{schema.label}</span>
                  <kbd className="border border-[#FF4500]/50 px-2 py-1 text-[#FF4500] font-black bg-[#FF4500]/10 shadow-[0_0_10px_rgba(255,69,0,0.1)] group-hover:shadow-[0_0_10px_rgba(255,69,0,0.3)] transition-all">
                    {schema.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Event Manifest */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70 flex justify-between font-sans">
              <span>Event Manifest</span>
              <span className="text-[#FF4500] font-mono">{events.length} LOGS</span>
            </h2>
            
            <div className="space-y-3 font-mono text-sm flex-1">
              {events.length === 0 ? (
                <div className="text-white/30 italic text-center mt-10">No events logged</div>
              ) : (
                [...events].reverse().map(event => (
                  <div key={event.id} className="border border-white/20 p-3 flex flex-col hover:border-[#FF4500] bg-zinc-950 transition-colors group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-white/20 group-hover:bg-[#FF4500] transition-colors"></div>
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#FF4500] font-bold text-lg">{formatTime(event.timestamp)}</span>
                        <div className="flex space-x-2 items-center">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest">ID:{event.id.toUpperCase()}</span>
                          <kbd className="border border-white/30 px-1.5 py-0.5 text-white/70 text-xs bg-zinc-900 group-hover:text-[#FF4500] group-hover:border-[#FF4500] transition-colors">
                            {event.key}
                          </kbd>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="uppercase text-white font-bold tracking-wider text-base font-sans">{event.tag}</span>
                        <span className="text-xs text-white/50 mt-1">System auto-generated log entry for {event.tag.toLowerCase()} event.</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
