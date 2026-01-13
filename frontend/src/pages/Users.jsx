import React, { useState } from 'react';
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
  IconButton,
  CircularProgress,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Chip,
  Tooltip,
  Card
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import userApi from '../api/userApi';
import departmentApi from '../api/departmentApi';
import { useUsers } from '../hooks/useUsers';

const Users = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passport_series: '',
    jshshir: '',
    phone_number: '',
    phone_number: '',
    roles: ['student'],
    department_id: '',
    department_id: '',
    password: ''
  });

  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useUsers();

  // Fetch departments for selection
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      handleClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleOpen = (user = null) => {
    if (user) {
      setEditMode(true);
      setSelectedUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        passport_series: user.passport_series || '',
        jshshir: user.jshshir || '',
        phone_number: user.phone_number || '',
        phone_number: user.phone_number || '',
        roles: user.roles?.map(r => r.name) || ['student'],
        department_id: user.department_id || '',
        department_id: user.department_id || '',
        password: ''
      });
    } else {
      setEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        passport_series: '',
        jshshir: '',
        phone_number: '',
        phone_number: '',
        roles: ['student'],
        department_id: '',
        department_id: '',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };

    // Clean up empty fields
    if (!payload.department_id) delete payload.department_id;
    if (!payload.password) delete payload.password;

    if (editMode && selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (isActive) => {
    if (isActive) return { bg: '#d1fae5', color: '#047857', label: 'Active' };
    return { bg: '#f3f4f6', color: '#4b5563', label: 'Inactive' };
  };

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'teacher': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'student': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'department_head': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredUsers = users?.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.jshshir?.includes(searchTerm)
  );

  return (
    <Box className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen dark:bg-slate-950">
      {/* Header Section */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <Box>
          <Typography variant="h4" className="font-extrabold text-slate-800 tracking-tight dark:text-white" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Xodimlar
          </Typography>
          <Typography variant="body1" className="text-slate-500 mt-2 font-medium dark:text-slate-400">
            Tizim foydalanuvchilarini boshqarish va nazorat qilish
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 rounded-2xl px-6 py-3 font-bold transition-all transform hover:scale-105"
          sx={{ textTransform: 'none', fontSize: '1rem' }}
        >
          Yangi Xodim
        </Button>
      </Box>

      {/* Toolbar & Filter */}
      <Card elevation={0} className="mb-8 rounded-3xl border border-slate-200/60 p-1.5 bg-white shadow-sm flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800">
        <Box className="flex-1 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl px-4 py-2.5 flex items-center border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white focus-within:shadow-sm dark:bg-slate-800 dark:hover:bg-slate-750 dark:focus-within:bg-slate-800">
          <SearchIcon className="text-slate-400 mr-3" />
          <InputBase
            placeholder="Qidirish (Ism, Email, JSHSHIR)..."
            className="w-full font-medium text-slate-700 placeholder:text-slate-400 dark:text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Button
          variant="text"
          startIcon={<FilterListIcon />}
          className="text-slate-600 hover:bg-slate-50 rounded-xl px-4 py-2.5 font-semibold normal-case dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Filterlash
        </Button>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper} elevation={0} className="rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow className="bg-slate-50/80 border-b border-slate-100 dark:bg-slate-800/80 dark:border-slate-700">
              <TableCell className="font-bold text-slate-400 text-xs uppercase tracking-wider pl-8 py-5">Foydalanuvchi</TableCell>
              <TableCell className="font-bold text-slate-400 text-xs uppercase tracking-wider py-5">Ma'lumotlar</TableCell>
              <TableCell className="font-bold text-slate-400 text-xs uppercase tracking-wider py-5">Lavozim</TableCell>
              <TableCell className="font-bold text-slate-400 text-xs uppercase tracking-wider py-5">Status</TableCell>
              <TableCell className="font-bold text-slate-400 text-xs uppercase tracking-wider pr-8 py-5" align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={40} thickness={4} sx={{ color: '#10b981' }} />
                  <Typography variant="body2" className="mt-4 text-slate-400 font-medium">Yuklanmoqda...</Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'error.main' }}>
                  Xatolik yuz berdi. Iltimos qayta urinib ko'ring.
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Box className="flex flex-col items-center opacity-60">
                    <PersonIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography className="text-slate-500 mt-2 font-medium dark:text-slate-400">Hech narsa topilmadi</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const statusStyle = getStatusColor(user.is_active);
                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors group dark:hover:bg-slate-800/50"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* User Column */}
                    <TableCell component="th" scope="row" className="pl-6 py-4">
                      <Box className="flex items-center gap-4">
                        <Avatar
                          src={user.avatar}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: user.roles?.some(r => r.name === 'admin') ? '#f43f5e' : user.roles?.some(r => r.name === 'teacher') ? '#3b82f6' : '#10b981',
                            fontSize: '1.25rem',
                            fontWeight: 'bold'
                          }}
                          className="shadow-md ring-4 ring-white dark:ring-slate-700"
                        >
                          {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" className="font-bold text-slate-800 text-base dark:text-slate-200">{user.name}</Typography>
                          <Typography variant="caption" className="text-slate-500 font-medium dark:text-slate-400">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Info Column */}
                    <TableCell className="py-4">
                      <Box className="flex flex-col gap-1.5">
                        {user.passport_series && (
                          <Box className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <BadgeIcon fontSize="inherit" className="text-slate-400" />
                            <Typography variant="caption" className="font-semibold">{user.passport_series}</Typography>
                          </Box>
                        )}
                        {user.jshshir && (
                          <Box className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <FingerprintIcon fontSize="inherit" className="text-slate-400" />
                            <Typography variant="caption" className="font-mono">{user.jshshir}</Typography>
                          </Box>
                        )}
                        {user.phone_number && (
                          <Box className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <PhoneIcon fontSize="inherit" className="text-slate-400" />
                            <Typography variant="caption" className="font-medium">{user.phone_number}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>

                    {/* Role Column */}
                    <TableCell className="py-4">
                      <Box className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <span key={role.id} className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${getRoleStyle(role.name)}`}>
                            {role.name?.replace('_', ' ')}
                          </span>
                        ))}
                      </Box>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="py-4">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-bold flex w-fit items-center gap-2"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                        </span>
                        {statusStyle.label}
                      </span>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right" className="pr-8 py-4">
                      <Box className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Tooltip title="Tahrirlash">
                          <IconButton
                            size="small"
                            className="bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 rounded-xl transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                            onClick={() => handleOpen(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="O'chirish">
                          <IconButton
                            size="small"
                            className="bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 rounded-xl transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-3xl p-2 dark:bg-slate-900 dark:text-white",
          elevation: 24
        }}
      >
        <DialogTitle className="font-bold text-slate-800 text-xl pb-1 dark:text-white">
          {editMode ? 'Xodimni Tahrirlash' : 'Yangi Xodim'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} className="mt-1">
              {/* Section Header */}
              <Grid item xs={12}>
                <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Shaxsiy Ma'lumotlar</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="F.I.O"
                  fullWidth
                  required
                  variant="outlined"
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone_number"
                  label="Telefon Raqam"
                  fullWidth
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </Grid>

              {/* Section Header */}
              <Grid item xs={12} className="mt-4">
                <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hujjatlar va Lavozim</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="passport_series"
                  label="Passport Seriya"
                  fullWidth
                  required
                  helperText="Format: AA1234567"
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.passport_series}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="jshshir"
                  label="JSHSHIR"
                  fullWidth
                  required
                  helperText="14 raqam"
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.jshshir}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel className="dark:text-slate-400">Roles</InputLabel>
                  <Select
                    name="roles"
                    multiple
                    value={formData.roles}
                    label="Roles"
                    onChange={handleChange}
                    className="bg-slate-50 rounded-xl dark:bg-slate-800 dark:text-white"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" className="dark:bg-slate-600 dark:text-white" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="student">👨‍🎓 Student</MenuItem>
                    <MenuItem value="teacher">👨‍🏫 Teacher</MenuItem>
                    <MenuItem value="admin">⚡ Admin</MenuItem>
                    <MenuItem value="department_head">👔 Kafedra Mudiri</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel className="dark:text-slate-400">Kafedra</InputLabel>
                  <Select
                    name="department_id"
                    value={formData.department_id}
                    label="Kafedra"
                    onChange={handleChange}
                    className="bg-slate-50 rounded-xl dark:bg-slate-800 dark:text-white"
                  >
                    <MenuItem value="">Tanlang</MenuItem>
                    {departments?.map(dept => (
                      <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Parol (Ixtiyoriy)"
                  type="password"
                  fullWidth
                  helperText={editMode ? "O'zgartirmaslik uchun bo'sh qoldiring" : "Bo'sh qoldirilsa Passport seriya bo'ladi"}
                  className="bg-slate-50 rounded-xl dark:bg-slate-800"
                  InputProps={{ className: "rounded-xl dark:text-white" }}
                  InputLabelProps={{ className: "dark:text-slate-400" }}
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="p-4 px-6">
            <Button onClick={handleClose} className="text-slate-500 hover:bg-slate-100 rounded-xl px-4 normal-case font-bold dark:text-slate-400 dark:hover:bg-slate-800">
              Bekor qilish
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 rounded-xl px-6 py-2 normal-case font-bold"
            >
              {editMode ? 'Saqlash' : 'Yaratish'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users;
