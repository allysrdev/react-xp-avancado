import { Person } from '@mui/icons-material';
import { Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useAuthContext } from '../contexts/authContext';

function UserProfile() {
  const { user, signOut } = useAuthContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        aria-label="Perfil"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar>
          <Person />
        </Avatar>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
          }}
        >
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>
        </Box>
        <MenuItem onClick={signOut}>Sair</MenuItem>
      </Menu>
    </Box>
  );
}

export default UserProfile;
