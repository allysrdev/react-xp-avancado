import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { reducer } from '../reducer/calendarScreenReducer';
import { getCalendarsEndpoint, getEventsEndpoint, type ICalendar, type IEvent } from '../backend';

type EventWithCalendar = IEvent & { calendar: ICalendar };

interface ICalendarCell {
  date: string;
  events: EventWithCalendar[];
  dayOfMonth: number;
}

interface IUseCalendarScreenState {
  month: string | null;
}

function useCalendarScreenState(props: IUseCalendarScreenState) {
  const { month } = props;

  const [state, dispatch] = useReducer(reducer, {
    editingEvent: null,
    selectedCalendars: [],
    events: [],
    calendars: [],
  });

  const { editingEvent, selectedCalendars, events, calendars } = state;

  function generateCalendar(
    date: string,
    allEvents: IEvent[],
    calendars: ICalendar[],
    selectedCalendars: boolean[] = [],
  ): ICalendarCell[][] {
    const weeks: ICalendarCell[][] = [];

    const jsDate = new Date(date + 'T12:00:00');
    const currentMonth = jsDate.getMonth();

    const currentDay = new Date(jsDate.valueOf());
    currentDay.setDate(1);

    const dayOfWeek = currentDay.getDay();

    currentDay.setDate(1 - dayOfWeek);

    do {
      const week: ICalendarCell[] = [];
      for (let i = 0; i < 7; i++) {
        const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, '0');
        const dayStr = currentDay.getDate().toString().padStart(2, '0');
        const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;
        const events: EventWithCalendar[] = [];

        for (const event of allEvents) {
          if (event.date === isoDate) {
            const callIndex = calendars.findIndex((calendar) => calendar.id === event.calendarId);
            if (selectedCalendars[callIndex]) {
              events.push({
                ...event,
                calendar: calendars[callIndex],
              });
            }
          }
        }

        week.push({
          dayOfMonth: currentDay.getDate(),
          date: isoDate,
          events,
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
    } while (currentDay.getMonth() === currentMonth);

    return weeks;
  }

  const weeks = useMemo(() => {
    return generateCalendar(month + '-01', events, calendars, selectedCalendars);
  }, [events, calendars, selectedCalendars, month]);

  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;
  useEffect(() => {
    Promise.all([getEventsEndpoint(firstDate, lastDate), getCalendarsEndpoint()]).then(
      ([PromisedEvents, PromisedCalendars]) => {
        dispatch({
          type: 'load',
          payload: { events: PromisedEvents, calendars: PromisedCalendars },
        });
      },
    );
  }, [firstDate, lastDate]);

  const closeDialog = useCallback(() => {
    dispatch({
      type: 'closeDialog',
    });
  }, []);

  function refreshEvents() {
    getEventsEndpoint(firstDate, lastDate).then((promisedEvents: IEvent[]) => {
      dispatch({
        type: 'load',
        payload: { events: promisedEvents },
      });
    });
  }

  return {
    weeks,
    closeDialog,
    refreshEvents,
    dispatch,
    editingEvent,
    selectedCalendars,
    events,
    calendars,
  };
}

export default useCalendarScreenState;
