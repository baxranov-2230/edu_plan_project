import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  InputBase
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useQuery } from '@tanstack/react-query';

import { useUsers } from '../hooks/useUsers';

const Users = () => {
  const { data: users, isLoading, error } = useUsers();

  const getStatusColor = (isActive) => {
    if (isActive) return { bg: '#ecfdf5', color: '#059669', label: 'Active', darkBg: '#064e3b' };
    return { bg: '#f1f5f9', color: '#64748b', label: 'Inactive', darkBg: '#1e293b' };
  };

  const getRoleBadge = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300';
      case 'teacher': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'student': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Box>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Xodimlar
          </Typography>
          <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mt-1">
            Barcha xodimlarni boshqarish
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 rounded-xl px-6 py-2.5 font-bold"
          sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
        >
          Xodim Qo'shish
        </Button>
      </Box>

      {/* Toolbar */}
      <Box className="flex items-center gap-4 mb-6">
        <Box className="flex-1 max-w-md bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center shadow-sm">
          <SearchIcon className="text-gray-400 mr-2" />
          <InputBase
            placeholder="Search users..."
            className="w-full text-sm text-slate-800 dark:text-slate-200"
          />
        </Box>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 rounded-xl h-[42px] normal-case"
        >
          Filters
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-800">
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead className="bg-gray-50/50 dark:bg-slate-700/50">
            <TableRow>
              <TableCell className="font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4">User</TableCell>
              <TableCell className="font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4">Role</TableCell>
              <TableCell className="font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4">Status</TableCell>
              <TableCell className="font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} thickness={4} sx={{ color: '#10b981' }} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'error.main' }}>
                  Error loading users
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => {
                const statusStyle = getStatusColor(user.is_active);
                return (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box className="flex items-center gap-4">
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>{user.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</Typography>
                          <Typography variant="caption" className="text-slate-500 dark:text-slate-400">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 dark:bg-opacity-20"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {statusStyle.label}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" className="text-slate-400 hover:text-emerald-600 transition-colors">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" className="text-slate-400 hover:text-red-500 transition-colors ml-1">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
