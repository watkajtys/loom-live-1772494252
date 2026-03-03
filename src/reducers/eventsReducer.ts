import { LogEvent } from '../types';

export type EventAction = 
  | { type: 'ADD_EVENT'; payload: { timestamp: number; tag: string; key: string } }
  | { type: 'CLEAR_EVENTS' };

export const eventsReducer = (state: LogEvent[], action: EventAction): LogEvent[] => {
  switch (action.type) {
    case 'ADD_EVENT':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          ...action.payload,
        }
      ];
    case 'CLEAR_EVENTS':
      return [];
    default:
      return state;
  }
};
