import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import useLayoutStore from '../store/layoutStore';

const MainLayout = () => {
  const { sidebarOpen } = useLayoutStore();

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          ml: sidebarOpen ? '256px' : '80px',
          minHeight: '100vh',
          width: `calc(100% - ${sidebarOpen ? '256px' : '80px'})`,
          transition: 'all 0.3s'
        }}
        className="bg-slate-100 dark:bg-slate-950"
      >
        <Box className="w-full">
          <Breadcrumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
