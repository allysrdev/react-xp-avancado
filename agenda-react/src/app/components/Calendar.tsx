import { WatchLater } from '@mui/icons-material';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { type ICalendar, type IEvent } from '../backend';
import { getToday } from '../helpers/dateHelper';
import type { ICalendarScreenAction } from '../reducer/calendarScreenReducer';

type EventWithCalendar = IEvent & { calendar: ICalendar };

interface ICalendarCell {
  date: string;
  events: EventWithCalendar[];
  dayOfMonth: number;
}

interface Props {
  weeks: ICalendarCell[][];
  dispatch: React.Dispatch<ICalendarScreenAction>;
}
export const Calendar = React.memo(function (props: Props) {
  const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const { weeks, dispatch } = props;

  function handleClick(evt: React.MouseEvent, date: string) {
    if (evt.target === evt.currentTarget) {
      dispatch({
        type: 'create',
        payload: date,
      });
    }
  }

  return (
    <TableContainer
      sx={{
        height: '100%',
        flex: '1',
      }}
      component={'div'}
    >
      <Table
        sx={{
          minWidth: '100%',
          minHeight: '100%',
          borderTop: '1px solid rgb(244,244,244)',
          '& td ~ td ': {
            borderLeft: '1px solid rgb(244,244,244)',
          },
          '& td': {
            verticalAlign: 'top',
            overflow: 'hidden',
            maxWidth: '60px',
          },
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {DAYS_OF_WEEK.map((day) => {
              return (
                <TableCell key={day} align="center">
                  {day}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((week, i) => {
            return (
              <TableRow key={i} sx={{ height: '100px' }}>
                {week.map((cell) => {
                  return (
                    <TableCell
                      key={cell.date}
                      align="center"
                      sx={{
                        padding: '8px',
                        verticalAlign: 'top',
                        height: '100px',
                        overflow: 'hidden',
                      }}
                      onClick={(evt) => handleClick(evt, cell.date)}
                    >
                      <Box
                        component="div"
                        sx={
                          cell.date == getToday()
                            ? {
                                fontWeight: 500,
                                marginBottom: '4px',
                                backgroundColor: '#1975d0',
                                borderRadius: 10,
                                width: 100,
                                margin: '0 auto',
                                color: 'white',
                              }
                            : {
                                fontWeight: 500,
                                marginBottom: '4px',
                              }
                        }
                      >
                        {cell.date.split('-')[2]}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          maxHeight: '72px',
                          overflowY: 'auto',
                        }}
                      >
                        {cell.events.length > 0 &&
                          cell.events.map((event) => {
                            const color = event.calendar.color;
                            return (
                              <Button
                                sx={{
                                  '&:focus': {
                                    outline: 'none',
                                  },
                                  '&:focus-visible': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                  },
                                  display: 'block',
                                  textAlign: 'left',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  padding: '4px',
                                  minHeight: 'auto',
                                  height: '24px',
                                  fontSize: '0.75rem',
                                  lineHeight: 1.2,
                                  backgroundColor: color,
                                  color: 'white',
                                }}
                                key={event.id}
                                onClick={() =>
                                  dispatch({
                                    type: 'edit',
                                    payload: event,
                                  })
                                }
                              >
                                {event.time && (
                                  <>
                                    <WatchLater fontSize="inherit" />
                                    <span>&nbsp;</span> {event.time}
                                  </>
                                )}{' '}
                                {event.desc}
                              </Button>
                            );
                          })}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default Calendar;
