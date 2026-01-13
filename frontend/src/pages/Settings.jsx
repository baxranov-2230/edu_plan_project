import React from 'react';
import { Box, Typography, Paper, Divider, Switch } from '@mui/material';
import useThemeStore from '../store/themeStore';

const Settings = () => {
  const { mode, toggleTheme } = useThemeStore();
  return (
    <Box>
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-slate-100 mb-6">Settings</Typography>

      <Paper className="p-6 rounded-2xl max-w-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <Box className="space-y-4">
          <Box className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <Box>
              <Typography className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</Typography>
              <Typography variant="caption" className="text-slate-500">
                Switch interface theme
              </Typography>
            </Box>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
              color="success"
            />
          </Box>
          <Box className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <Typography className="font-medium text-slate-800 dark:text-slate-200">Notifications</Typography>
            <Typography className="text-sm text-emerald-600 font-bold">Enabled</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
