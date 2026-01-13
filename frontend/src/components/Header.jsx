import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useLayoutStore from '../store/layoutStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const { sidebarOpen } = useLayoutStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sidebarOpen ? '256px' : '80px'})`,
        ml: sidebarOpen ? '256px' : '80px',
        bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        zIndex: 10,
        transition: 'all 0.3s'
      }}
    >
      <Toolbar className="justify-between min-h-[80px]">
        {/* Search Bar */}
        <Box className={`relative hidden md:flex items-center rounded-full px-4 py-2 w-96 border transition-colors focus-within:shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700 focus-within:border-emerald-500/50' : 'bg-gray-100/50 border-gray-200 focus-within:bg-white focus-within:border-emerald-500/50'}`}>
          <SearchIcon className={`mr-2 ${mode === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} />
          <InputBase
            placeholder="Search for students, classes..."
            className={`w-full text-sm font-medium ${mode === 'dark' ? 'text-slate-200' : 'text-gray-600'}`}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        {/* Right Icons */}
        <Box className="flex items-center gap-2">
          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} size="large" className={`transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-yellow-400' : 'text-gray-400 hover:text-orange-500'}`}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton size="large" className={`transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-emerald-500' : 'text-gray-400 hover:text-emerald-600'}`}>
            <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton size="large" className={`transition-colors ${mode === 'dark' ? 'text-slate-400 hover:text-emerald-500' : 'text-gray-400 hover:text-emerald-600'}`}>
            <SettingsIcon />
          </IconButton>

          <Box className={`h-8 w-[1px] mx-2 ${mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`} />

          <IconButton
            onClick={handleMenu}
            sx={{ p: 0.5, border: '2px solid transparent', '&:hover': { borderColor: '#10b981' } }}
          >
            <Avatar
              sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 'bold' }}
              src={user?.avatar}
              alt={user?.name}
            >
              {user?.name?.[0]}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                borderRadius: 3,
                minWidth: 180,
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                bgcolor: 'background.paper',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                  borderLeft: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                },
              },
            }}
          >
            <Box className={`px-4 py-2 mb-2 border-b ${mode === 'dark' ? 'border-slate-700' : 'border-gray-100'}`}>
              <Typography variant="subtitle2" className={`font-bold ${mode === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>My Account</Typography>
              <Typography variant="caption" className={`${mode === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>{user?.role || 'Administrator'}</Typography>
            </Box>
            <MenuItem onClick={handleClose} className={`rounded-lg mx-2 mb-1 text-sm ${mode === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}>Profile Details</MenuItem>
            <MenuItem onClick={handleClose} className={`rounded-lg mx-2 mb-1 text-sm ${mode === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}>Account Settings</MenuItem>
            <MenuItem onClick={handleLogout} className={`rounded-lg mx-2 mb-1 text-red-500 text-sm ${mode === 'dark' ? 'hover:bg-red-900/10' : 'hover:bg-red-50'}`}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
