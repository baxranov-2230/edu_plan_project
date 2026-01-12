import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', bgcolor: '#f1f5f9' }}> {/* Slate-100 background */}
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{ 
            flexGrow: 1, 
            p: 4, 
            mt: 8, 
            ml: '288px', // Matching new Sidebar width
            minHeight: '100vh',
            width: 'calc(100% - 288px)'
        }}
        className="bg-slate-100"
      >
        <Box className="w-full">
            <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
