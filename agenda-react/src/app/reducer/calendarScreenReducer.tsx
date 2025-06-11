import type { ICalendar, IEvent } from '../backend';

export interface ICalendarScreenState {
  editingEvent: IEvent | null;
  selectedCalendars: boolean[];
  events: IEvent[];
  calendars: ICalendar[];
}

export type ICalendarScreenAction =
  | {
      type: 'load';
      payload: { events: IEvent[]; calendars?: ICalendar[] };
    }
  | {
      type: 'edit';
      payload: IEvent;
    }
  | {
      type: 'create';
      payload: string;
    }
  | {
      type: 'closeDialog';
    }
  | {
      type: 'toggleCalendar';
      payload: number;
    };

export function reducer(
  state: ICalendarScreenState,
  action: ICalendarScreenAction,
): ICalendarScreenState {
  switch (action.type) {
    case 'load': {
      const calendars = action.payload.calendars || state.calendars;
      const selectedCalendars = action.payload.calendars
        ? calendars.map(() => true)
        : state.selectedCalendars;

      return {
        ...state,
        events: action.payload.events,
        calendars,
        selectedCalendars,
      };
    }
    case 'edit':
      return {
        ...state,
        editingEvent: action.payload,
      };
    case 'create':
      return {
        ...state,
        editingEvent: {
          date: action.payload,
          desc: '',
          calendarId: state.calendars[0].id,
        },
      };
    case 'closeDialog':
      return {
        ...state,
        editingEvent: null,
      };
    case 'toggleCalendar': {
      const newValue = [...state.selectedCalendars];
      newValue[action.payload] = !newValue[action.payload];

      return {
        ...state,
        selectedCalendars: newValue,
      };
    }

    default:
      return state;
  }
}
