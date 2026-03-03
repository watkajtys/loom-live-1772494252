import React from 'react';
import { LogEvent } from '../types';
import { formatTime } from '../utils/timeFormat';

interface EventManifestProps {
  events: LogEvent[];
}

export const EventManifest = React.memo(({ events }: EventManifestProps) => {
  return (
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
  );
});

EventManifest.displayName = 'EventManifest';
