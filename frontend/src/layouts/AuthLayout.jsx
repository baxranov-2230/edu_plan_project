import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box>
      {/* We are Handling the full page background in the Login page/Outlet mostly, but this wrapper ensures structure */}
       <Outlet />
    </Box>
  );
};

export default AuthLayout;
