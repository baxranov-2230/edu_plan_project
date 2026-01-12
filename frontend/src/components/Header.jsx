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
  InputBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuthStore();
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
        width: 'calc(100% - 288px)', // 72 = 18rem = 288px (Sidebar width)
        ml: '288px', // Matching sidebar width
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        zIndex: 10
      }}
    >
      <Toolbar className="justify-between min-h-[80px]">
        {/* Search Bar */}
        <Box className="relative hidden md:flex items-center bg-gray-100/50 rounded-full px-4 py-2 w-96 border border-gray-200 transition-colors focus-within:bg-white focus-within:border-emerald-500/50 focus-within:shadow-sm">
          <SearchIcon className="text-gray-400 mr-2" />
          <InputBase
            placeholder="Search for students, classes..."
            className="w-full text-sm font-medium text-gray-600"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        {/* Right Icons */}
        <Box className="flex items-center gap-2">
          <IconButton size="large" className="text-gray-400 hover:text-emerald-600 transition-colors">
            <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 16, minWidth: 16 } }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton size="large" className="text-gray-400 hover:text-emerald-600 transition-colors">
            <SettingsIcon />
          </IconButton>

          <Box className="h-8 w-[1px] bg-gray-200 mx-2" />

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
                },
              },
            }}
          >
            <Box className="px-4 py-2 border-b border-gray-100 mb-2">
               <Typography variant="subtitle2" className="font-bold text-gray-800">My Account</Typography>
               <Typography variant="caption" className="text-gray-500">{user?.role || 'Administrator'}</Typography>
            </Box>
            <MenuItem onClick={handleClose} className="rounded-lg mx-2 mb-1 hover:bg-gray-50 text-sm">Profile Details</MenuItem>
            <MenuItem onClick={handleClose} className="rounded-lg mx-2 mb-1 hover:bg-gray-50 text-sm">Account Settings</MenuItem>
            <MenuItem onClick={handleLogout} className="rounded-lg mx-2 mb-1 hover:bg-red-50 text-red-600 text-sm">Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
