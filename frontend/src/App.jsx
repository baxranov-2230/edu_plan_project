import React, { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import router from './router/router';
import getTheme from './theme';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

const queryClient = new QueryClient();

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { mode } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sync Tailwind Dark Mode
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} theme={mode} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
