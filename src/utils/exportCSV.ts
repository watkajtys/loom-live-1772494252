import { LogEvent } from '../types';
import { formatTime } from './timeFormat';

export const exportCSV = (events: LogEvent[]) => {
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
