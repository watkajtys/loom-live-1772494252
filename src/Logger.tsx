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
          <div className="flex-1 border-b border-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl aspect-video border border-white flex items-center justify-center bg-zinc-900 relative">
              <span className="text-white/50 text-xl font-bold tracking-widest uppercase">Video Signal Input</span>
              
              {/* Overlay Play State */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-[#FF4500] animate-pulse' : 'bg-white/50'}`}></div>
                <span className="font-mono text-sm">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
              </div>
            </div>
            
            {/* Player Controls */}
            <div className="w-full max-w-4xl mt-4 flex items-center justify-between font-mono">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`border px-6 py-2 uppercase font-bold tracking-widest transition-colors ${isPlaying ? 'border-[#FF4500] text-[#FF4500]' : 'border-white text-white hover:bg-white hover:text-black'}`}
              >
                {isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              </button>
              <div className="text-4xl text-[#FF4500] tracking-widest">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 p-4 flex flex-col">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70">Timeline</h2>
            <div className="flex-1 border border-white relative overflow-hidden bg-zinc-950">
              {/* Playhead */}
              <div className="absolute top-0 bottom-0 w-px bg-[#FF4500] z-10 left-1/2">
                <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-[#FF4500] rotate-45"></div>
              </div>
              
              {/* Tracks */}
              <div className="absolute inset-0 flex flex-col justify-around py-4">
                {TAG_SCHEMA.map(schema => (
                  <div key={schema.key} className="h-4 border-b border-white/20 relative w-full">
                    <span className="absolute -left-0 -top-4 text-[10px] text-white/50 font-mono px-2">{schema.label}</span>
                    {/* Event markers would go here */}
                    {events.filter(e => e.tag === schema.label).map(e => {
                      // Mock positioning based on time relative to playhead (assuming 10s window for viz)
                      const timeDiff = e.timestamp - currentTime;
                      const leftPos = `calc(50% + ${timeDiff * 10}%)`;
                      return Math.abs(timeDiff) < 5 ? (
                        <div key={e.id} className="absolute top-0 w-2 h-4 bg-[#FF4500]" style={{ left: leftPos }}></div>
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
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70">Tag Schema</h2>
            <div className="space-y-2">
              {TAG_SCHEMA.map(schema => (
                <div key={schema.key} className="flex justify-between items-center border border-white/30 p-2 text-sm font-mono">
                  <span>{schema.label}</span>
                  <kbd className="border border-white/50 px-2 py-0.5 text-[#FF4500] bg-zinc-900">{schema.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Event Manifest */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/70 flex justify-between">
              <span>Event Manifest</span>
              <span>{events.length}</span>
            </h2>
            
            <div className="space-y-2 font-mono text-sm flex-1">
              {events.length === 0 ? (
                <div className="text-white/30 italic text-center mt-10">No events logged</div>
              ) : (
                [...events].reverse().map(event => (
                  <div key={event.id} className="border border-white/20 p-2 flex flex-col hover:border-[#FF4500] transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#FF4500] font-bold">{formatTime(event.timestamp)}</span>
                      <span className="text-xs text-white/50">[{event.key}]</span>
                    </div>
                    <span className="uppercase text-white/90">{event.tag}</span>
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
