import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import Calendar from './Calendar';
import EventFormDialog from './EventFormDialog';
import { getToday } from '../helpers/dateHelper';
import useCalendarScreenState from '../hooks/useCalendarScreenState';

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();
  const {
    calendars,
    selectedCalendars,
    weeks,
    editingEvent,
    dispatch,
    closeDialog,
    refreshEvents,
  } = useCalendarScreenState({ month: month || '' });

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box borderRight="1px solid rgb(244,244,244)" width="16em" padding="8px 16px">
        <h2>Agenda React</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            dispatch({
              type: 'create',
              payload: getToday(),
            })
          }
        >
          Novo Evento
        </Button>

        <CalendarsView
          calendars={calendars}
          selectedCalendars={selectedCalendars}
          dispatch={dispatch}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <CalendarHeader month={month!} />
        <Calendar weeks={weeks} dispatch={dispatch} />
        <EventFormDialog
          calendars={calendars}
          event={editingEvent}
          onClose={closeDialog}
          onSave={() => {
            closeDialog();
            refreshEvents();
          }}
        />
      </Box>
    </Box>
  );
}
