import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StatCard = ({ title, value, icon, color, gradient }) => (
  <Paper 
    elevation={0} 
    className="relative overflow-hidden p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group"
    sx={{ 
      background: 'white',
      border: '1px solid rgba(0,0,0,0.05)'
    }}
  >
    <Box className="flex justify-between items-start mb-4">
      <Box 
        className={`p-3 rounded-xl text-white shadow-lg ${gradient}`}
      >
        {React.cloneElement(icon, { sx: { fontSize: 28 } })}
      </Box>
       <Box className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
        <TrendingUpIcon sx={{ fontSize: 14 }} /> +12%
      </Box>
    </Box>
    
    <Box>
      <Typography variant="h4" className="font-bold text-slate-800 mb-1">
        {value}
      </Typography>
      <Typography variant="body2" className="text-slate-500 font-medium">
        {title}
      </Typography>
    </Box>

    {/* Decorative blur in background */}
    <Box 
       className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110"
       sx={{ bgcolor: color }}
    />
  </Paper>
);

const Dashboard = () => {
  return (
    <Box>
      <Box className="flex justify-between items-end mb-8">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </Typography>
          <Typography variant="body1" className="text-slate-500 mt-1">
            Welcome back, here's what's happening today.
          </Typography>
        </Box>
        <Button variant="contained" className="bg-slate-900 text-white hover:bg-slate-800 capitalize rounded-xl shadow-lg shadow-slate-900/20">
          Download Report
        </Button>
      </Box>

      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Total Students" 
            value="3,234" 
            icon={<PeopleIcon />} 
            color="#0ea5e9"
            gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Active Classes" 
            value="86" 
            icon={<ClassIcon />} 
             color="#8b5cf6"
             gradient="bg-gradient-to-br from-violet-400 to-purple-500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Lesson Plans" 
            value="428" 
            icon={<ArticleIcon />} 
             color="#f59e0b"
             gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Pending Reviews" 
            value="15" 
            icon={<AssignmentIcon />} 
             color="#ef4444"
             gradient="bg-gradient-to-br from-red-400 to-pink-500"
          />
        </Grid>
      </Grid>
      
      {/* Content Section Placeholder */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 bg-white h-96 flex flex-col items-center justify-center text-slate-400 shadow-sm">
             <Typography>Activity Chart Placeholder</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
           <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 bg-white h-96 shadow-sm">
             <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-slate-800">Recent Users</Typography>
                <MoreVertIcon className="text-slate-400" />
             </Box>
             {/* List placeholder */}
             {[1,2,3,4].map(i => (
               <Box key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                 <div className="w-10 h-10 rounded-full bg-slate-100" />
                 <Box>
                   <div className="w-32 h-3 bg-slate-100 rounded mb-1" />
                   <div className="w-20 h-2 bg-slate-50 rounded" />
                 </Box>
               </Box>
             ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
