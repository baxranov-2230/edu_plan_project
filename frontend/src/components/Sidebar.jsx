import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Classes', icon: <SchoolIcon />, path: '/classes' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box 
      className="h-full bg-slate-900 border-r border-slate-800 text-white w-72 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 shadow-2xl"
    >
      {/* Brand Area */}
      <Box className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <SchoolIcon className="text-white" fontSize="medium" />
        </div>
        <Box>
           <Typography variant="h6" className="font-bold tracking-tight text-white leading-tight">
            EduPanel
          </Typography>
          <Typography variant="caption" className="text-slate-400 font-medium">
            Admin Pro
          </Typography>
        </Box>
      </Box>

      <Box className="px-6 mb-2">
        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          Main Menu
        </Typography>
      </Box>

      <List className="flex-grow px-3">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="mb-2">
            <NavLink 
              to={item.path}
              className={({ isActive }) => 
                `w-full rounded-xl text-sm font-medium transition-all duration-200 group no-underline
                 ${isActive 
                   ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' 
                   : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                 }`
              }
            >
              <ListItemButton sx={{ borderRadius: '12px', py: 1.5 }}>
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: 'inherit',
                    '& .MuiSvgIcon-root': { fontSize: 22 }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 'medium' }} 
                />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>

      {/* User Profile Snippet at Bottom */}
      <Box className="p-4 border-t border-slate-800/50 m-4 bg-slate-800/30 rounded-2xl">
        <Box className="flex items-center gap-3">
          <Avatar 
            className="border-2 border-emerald-500/30"
            src={user?.avatar || ''}
            sx={{ bgcolor: 'primary.dark' }}
          >
            {user?.name?.[0] || 'A'}
          </Avatar>
          <Box className="overflow-hidden">
             <Typography variant="subtitle2" className="text-white font-semibold truncate">
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" className="text-slate-400 truncate block">
              {user?.email || 'admin@edu.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
