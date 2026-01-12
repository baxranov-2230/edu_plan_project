import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const Settings = () => {
  return (
    <Box>
       <Typography variant="h4" className="font-bold text-slate-800 mb-6">Settings</Typography>
       
       <Paper className="p-6 rounded-2xl max-w-2xl border border-slate-200 shadow-sm">
         <Typography variant="h6" className="font-bold text-slate-700 mb-4">General Settings</Typography>
         <Box className="space-y-4">
            <Box className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <Typography className="font-medium">Dark Mode</Typography>
              <Typography className="text-sm text-slate-500">Disabled (Coming Soon)</Typography>
            </Box>
             <Box className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <Typography className="font-medium">Notifications</Typography>
              <Typography className="text-sm text-emerald-600 font-bold">Enabled</Typography>
            </Box>
         </Box>
       </Paper>
    </Box>
  );
};

export default Settings;
