import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { addMonth, formatMonth } from '../helpers/dateHelper';
import UserProfile from './UserProfile';
import React from 'react';
interface Props {
  month: string;
}

export const CalendarHeader = React.memo(function (props: Props) {
  const { month } = props;

  return (
    <Box display={'flex'} alignItems={'center'} padding={'8px 16px'}>
      <Box>
        <IconButton
          aria-label="Mês Anterior"
          component={Link}
          to={`/calendar/${addMonth(month!, -1)}`}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          aria-label="Próximo Mês"
          component={Link}
          to={`/calendar/${addMonth(month!, 1)}`}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      <Box flex="1" component="h3" marginLeft="16px">
        {formatMonth(month!)}
      </Box>
      <UserProfile />
    </Box>
  );
});

export default CalendarHeader;
