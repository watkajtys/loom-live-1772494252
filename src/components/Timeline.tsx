import React from 'react';
import { LogEvent } from '../types';
import { TAG_SCHEMA } from '../constants';

interface TimelineProps {
  currentTime: number;
  events: LogEvent[];
}

export const Timeline = React.memo(({ currentTime, events }: TimelineProps) => {
  return (
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
  );
});

Timeline.displayName = 'Timeline';
