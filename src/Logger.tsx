import React, { useEffect, useReducer } from 'react';
import { Download } from 'lucide-react';

import { TAG_SCHEMA } from './constants';
import { exportCSV } from './utils/exportCSV';
import { useTimer } from './hooks/useTimer';
import { eventsReducer } from './reducers/eventsReducer';

import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { EventManifest } from './components/EventManifest';

export default function Logger() {
  const { isPlaying, currentTime, currentTimeRef, togglePlay } = useTimer();
  const [events, dispatch] = useReducer(eventsReducer, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keydown if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
        return;
      }

      const matchingSchema = TAG_SCHEMA.find(schema => schema.key === e.key);
      if (matchingSchema) {
        dispatch({
          type: 'ADD_EVENT',
          payload: {
            timestamp: currentTimeRef.current,
            tag: matchingSchema.label,
            key: matchingSchema.key
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTimeRef]);

  const handleExportCSV = () => {
    exportCSV(events);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase">Warp Logger</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase font-bold text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <div className="flex items-center space-x-2 border border-white/30 px-3 py-1 bg-zinc-950">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#FF4500] animate-pulse' : 'bg-white/30'}`}></div>
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">Sys: Online</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col border-r border-white">
          <VideoPlayer isPlaying={isPlaying} currentTime={currentTime} togglePlay={togglePlay} />
          <Timeline currentTime={currentTime} events={events} />
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

          <EventManifest events={events} />
        </aside>
      </div>
    </div>
  );
}
