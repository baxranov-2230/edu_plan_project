import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Fade
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import ClassIcon from '@mui/icons-material/Class';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import AssignmentIcon from '@mui/icons-material/Assignment';
import useAuthStore from '../store/authStore';
import useLayoutStore from '../store/layoutStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useLayoutStore();
  const location = useLocation();

  const menuItems = [
    { text: 'Bosh sahifa', icon: <DashboardIcon />, path: '/dashboard' },
    { text: "Fanlar", icon: <SchoolIcon />, path: '/curriculums' },
    // { text: 'Fayllar', icon: <ArticleIcon />, path: '/downloads' },
    // { text: 'Fan dasturlari', icon: <ClassIcon />, path: '/programs' },
    { text: 'Xodimlar', icon: <PeopleIcon />, path: '/users' },
    { text: 'Fakultetlar', icon: <SchoolIcon />, path: '/faculties' },
    { text: 'Kafedralar', icon: <SchoolIcon />, path: '/departments' },
    { text: 'Mutaxassisliklar', icon: <SchoolIcon />, path: '/specialities' },
    { text: 'Guruhlar', icon: <GroupIcon />, path: '/groups' },
    { text: "O'qituvchilar", icon: <PersonIcon />, path: '/teachers' },
    { text: 'Potoklar', icon: <ViewStreamIcon />, path: '/streams' },
    { text: 'Yuklamalar', icon: <AssignmentIcon />, path: '/workloads' },
    { text: 'Rollar', icon: <LockPersonIcon />, path: '/roles' },
    { text: 'Sozlamalar', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box
      className={`h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-64' : 'w-20'
        }`}
    >
      {/* Brand Area */}
      <Box className={`flex items-center justify-between p-4 ${!sidebarOpen && 'justify-center'}`}>
        <Box className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <SchoolIcon className="text-white" sx={{ fontSize: 20 }} />
          </div>

          <Box className="overflow-hidden whitespace-nowrap">
            <Typography variant="subtitle1" className="font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
              EduPanel
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          size="small"
        >
          {sidebarOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Box className={`mb-2 px-6 ${!sidebarOpen && 'hidden'}`}>
        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          Main Menu
        </Typography>
      </Box>

      <List className="flex-grow px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="mb-2 block">
            <Tooltip title={!sidebarOpen ? item.text : ''} placement="right" arrow>
              <NavLink
                to={item.path}
                className={() =>
                  `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group no-underline relative overflow-hidden
                   ${location.pathname.startsWith(item.path)
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <ListItemButton
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: sidebarOpen ? 2 : 'auto',
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    minHeight: 48
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : 0,
                      justifyContent: 'center',
                      color: 'inherit',
                      '& .MuiSvgIcon-root': { fontSize: 22 }
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 'medium' }}
                    sx={{
                      opacity: sidebarOpen ? 1 : 0,
                      width: sidebarOpen ? 'auto' : 0,
                      visibility: sidebarOpen ? 'visible' : 'hidden',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  />
                </ListItemButton>
              </NavLink>
            </Tooltip>
          </ListItem>
        ))}
      </List>



      {/* User Profile Snippet at Bottom */}
      <Box className={`border-t border-slate-200 dark:border-slate-800/50 m-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl transition-all ${sidebarOpen ? 'p-4' : 'p-2'
        }`}>
        <Box className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
          <Avatar
            className="border-2 border-emerald-500/30"
            src={user?.avatar || ''}
            sx={{ bgcolor: 'primary.dark', width: sidebarOpen ? 40 : 32, height: sidebarOpen ? 40 : 32 }}
          >
            {user?.name?.[0] || 'A'}
          </Avatar>

          <Box className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'
            }`}>
            <Typography variant="subtitle2" className="text-slate-800 dark:text-white font-semibold truncate max-w-[120px]">
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" className="text-slate-400 truncate block max-w-[120px]">
              {user?.email || 'admin@edu.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
