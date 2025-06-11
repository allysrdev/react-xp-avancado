import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import type { ICalendar } from '../backend';
import type { ICalendarScreenAction } from '../reducer/calendarScreenReducer';

interface Props {
  calendars: ICalendar[];
  selectedCalendars: boolean[];
  dispatch: React.Dispatch<ICalendarScreenAction>;
}

export const CalendarsView = React.memo(function (props: Props) {
  const { calendars, selectedCalendars, dispatch } = props;

  return (
    <Box flex="1" marginTop="64px">
      <h3>Agendas</h3>
      {calendars.map((calendar, i) => {
        return (
          <FormControlLabel
            key={calendar.id}
            control={
              <Checkbox
                checked={selectedCalendars[i]}
                onChange={() => dispatch({ type: 'toggleCalendar', payload: i })}
                sx={{ color: calendar.color, '&.Mui-checked': { color: calendar.color } }}
              />
            }
            label={calendar.name}
          />
        );
      })}
    </Box>
  );
});

export default CalendarsView;
