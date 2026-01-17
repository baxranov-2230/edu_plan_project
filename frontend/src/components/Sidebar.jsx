import React, { useState } from 'react';
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
  Fade,
  Collapse
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Struktura uchun
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import useAuthStore from '../store/authStore';
import useLayoutStore from '../store/layoutStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useLayoutStore();
  const location = useLocation();

  // State for collapsible menus
  const [openSubMenus, setOpenSubMenus] = useState({
    structure: false,
    education: false // New group
  });

  const handleSubMenuClick = (key) => {
    if (!sidebarOpen) toggleSidebar(); // Open sidebar if clicking a parent helper
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { text: 'Bosh sahifa', icon: <DashboardIcon />, path: '/dashboard' },

    // Structure Group
    {
      text: 'Struktura',
      icon: <AccountBalanceIcon />,
      key: 'structure',
      children: [
        { text: 'Fakultetlar', icon: <SchoolIcon />, path: '/faculties' },
        { text: 'Kafedralar', icon: <SchoolIcon />, path: '/departments' },
        { text: 'Mutaxassisliklar', icon: <SchoolIcon />, path: '/specialities' },
        { text: 'Guruhlar', icon: <GroupIcon />, path: '/groups' },
        { text: 'Potoklar', icon: <ViewStreamIcon />, path: '/streams' },
      ]
    },

    // Education Group
    {
      text: "O'quv Jarayoni",
      icon: <SchoolIcon />,
      key: 'education',
      children: [
        { text: "Fanlar", icon: <SchoolIcon />, path: '/subjects' },
        { text: "O'quv Rejalar", icon: <ArticleIcon />, path: '/edu-plans' },
        { text: 'Yuklamalar', icon: <AssignmentIcon />, path: '/workloads' },
      ]
    },

    { text: 'Xodimlar', icon: <PeopleIcon />, path: '/users' },
    { text: "O'qituvchilar", icon: <PersonIcon />, path: '/teachers' },
    { text: 'Rollar', icon: <LockPersonIcon />, path: '/roles' },
    { text: 'Sozlamalar', icon: <SettingsIcon />, path: '/settings' },
  ];

  const renderMenuItem = (item) => {
    // Helper to check if a path is active (including sub-paths)
    const isPathActive = (path) => {
      if (path === '/' || path === '/dashboard') {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    };

    // If it's a grouped item (parent)
    if (item.children) {
      const isOpen = openSubMenus[item.key];
      const isActiveChild = item.children.some(child => isPathActive(child.path));

      return (
        <React.Fragment key={item.key}>
          <ListItem disablePadding className="mb-2 block">
            <Tooltip title={!sidebarOpen ? item.text : ''} placement="right" arrow>
              <ListItemButton
                onClick={() => handleSubMenuClick(item.key)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: sidebarOpen ? 2 : 'auto',
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  minHeight: 48,
                  color: isActiveChild ? 'rgb(5 150 105)' : 'inherit', // Emerald-600 if active child
                  bgcolor: isActiveChild ? 'rgb(236 253 245)' : 'transparent' // Emerald-50
                }}
                className={`transition-all duration-200 ${!sidebarOpen ? 'hover:bg-slate-50 dark:hover:bg-slate-800' : ''}`}
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
                    whiteSpace: 'nowrap'
                  }}
                />
                {sidebarOpen && (isOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
          </ListItem>

          <Collapse in={isOpen && sidebarOpen} timeout="auto" unmountOnExit>
            <Box className="relative ml-5 pl-3 border-l-2 border-slate-100 dark:border-slate-800 my-1">
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItem key={child.text} disablePadding className="mb-1 block">
                    <NavLink
                      to={child.path}
                      className={() => {
                        const active = isPathActive(child.path);
                        return `flex items-center rounded-lg text-sm transition-all duration-200 group no-underline relative overflow-hidden
                        ${active
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50'
                          }`;
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: '8px',
                          py: 1,
                          pl: 2,
                          minHeight: 36
                        }}
                      >
                        {/* <ListItemIcon sx={{ minWidth: 24, color: 'inherit', mr: 1 }}>
                                {child.icon}
                            </ListItemIcon> */}
                        <Typography variant="body2" fontSize="0.9rem">
                          {child.text}
                        </Typography>
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </React.Fragment>
      );
    }

    // Checking active state for single items
    return (
      <ListItem key={item.text} disablePadding className="mb-2 block">
        <Tooltip title={!sidebarOpen ? item.text : ''} placement="right" arrow>
          <NavLink
            to={item.path}
            className={() => {
              const active = isPathActive(item.path);
              return `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group no-underline relative overflow-hidden
                 ${active
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`;
            }}
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
    );
  };

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
        {menuItems.map((item) => renderMenuItem(item))}
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
