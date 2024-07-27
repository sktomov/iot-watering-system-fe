import React from 'react';
import { Avatar, Button, Menu, MenuItem, Typography } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';

const UserMenu = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = getAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful
    }).catch((error) => {
      // An error happened
      console.error("Sign out error", error);
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0' }}>
      <Typography variant="h6" style={{ marginRight: '10px' }}>
        Здравей, {user.displayName}!
      </Typography>
      {user.photoURL && (
        <Avatar src={user.photoURL} alt={user.displayName} onClick={handleMenuOpen} style={{ cursor: 'pointer' }} />
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
