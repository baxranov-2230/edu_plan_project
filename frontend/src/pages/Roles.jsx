import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRoles, usePermissions, useCreateRole, useUpdateRole, useDeleteRole } from '../hooks/useRoles';

const Roles = () => {
    const { data: roles = [] } = useRoles();
    const { data: permissions = [] } = usePermissions();

    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole();
    const deleteMutation = useDeleteRole();

    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

    // Removed useEffect fetching

    const handleOpen = (role = null) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions.map(p => p.id)
            });
        } else {
            setEditingRole(null);
            setFormData({ name: '', description: '', permissions: [] });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRole(null);
    };

    const handlePermissionChange = (permId) => {
        setFormData(prev => {
            const currentPerms = prev.permissions;
            if (currentPerms.includes(permId)) {
                return { ...prev, permissions: currentPerms.filter(id => id !== permId) };
            } else {
                return { ...prev, permissions: [...currentPerms, permId] };
            }
        });
    };

    const handleSubmit = async () => {
        if (editingRole) {
            updateMutation.mutate({ id: editingRole.id, data: formData }, {
                onSuccess: () => handleClose()
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => handleClose()
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteMutation.mutate(id);
        }
    };

    const getPermissionColor = (slug) => {
        if (slug.includes('delete')) return 'error';
        if (slug.includes('create')) return 'success';
        if (slug.includes('update')) return 'warning';
        if (slug.includes('read')) return 'info';
        return 'default';
    };

    return (
        <Box className="p-6">
            <Paper
                elevation={0}
                className="p-6 mb-8 rounded-3xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700"
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <Typography variant="h4" className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 mb-2">
                            Rollar va Ruxsatlar
                        </Typography>
                        <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
                            Tizimdagi barcha rollar va ularning huquqlarini boshqaring
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/30 text-white font-bold transform transition-transform hover:scale-105"
                    >
                        Yangi Rol
                    </Button>
                </div>
            </Paper>

            <TableContainer component={Paper} elevation={0} className="rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <TableRow>
                            <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-5">ID</TableCell>
                            <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-5">Nomi</TableCell>
                            <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-5">Tavsif</TableCell>
                            <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-5">Ruxsatlar</TableCell>
                            <TableCell align="right" className="font-bold text-slate-500 dark:text-slate-400 py-5">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <TableCell className="font-semibold text-slate-400">{role.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-lg text-slate-700 dark:text-slate-200">{role.name}</div>
                                </TableCell>
                                <TableCell className="text-slate-500">{role.description}</TableCell>
                                <TableCell>
                                    <Box className="flex flex-wrap gap-2">
                                        {role.permissions?.map((p) => (
                                            <Chip
                                                key={p.id}
                                                label={p.slug}
                                                size="small"
                                                color={getPermissionColor(p.slug)}
                                                variant="outlined"
                                                className="font-medium bg-white dark:bg-slate-900 border-opacity-50"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <IconButton size="small" onClick={() => handleOpen(role)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 mr-2">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(role.id)} className="bg-red-50 hover:bg-red-100 text-red-600">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "rounded-3xl p-2"
                }}
            >
                <DialogTitle className="font-bold text-2xl border-b border-slate-100 dark:border-slate-800 pb-4">
                    {editingRole ? 'Rolni Tahrirlash' : 'Yangi Rol'}
                </DialogTitle>
                <DialogContent className="pt-6">
                    <Box className="flex flex-col gap-6 mt-4">
                        <TextField
                            label="Nomi"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            variant="outlined"
                            className="bg-slate-50 dark:bg-slate-900"
                            InputProps={{ className: "rounded-xl" }}
                            disabled={!!editingRole}
                        />
                        <TextField
                            label="Tavsif"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            className="bg-slate-50 dark:bg-slate-900"
                            InputProps={{ className: "rounded-xl" }}
                        />

                        <div>
                            <Typography variant="subtitle1" className="font-bold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                Ruxsatlar
                            </Typography>
                            <Box className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {permissions.map((perm) => (
                                        <div key={perm.id} className="flex items-center p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                            <Checkbox
                                                checked={formData.permissions.includes(perm.id)}
                                                onChange={() => handlePermissionChange(perm.id)}
                                                className="text-emerald-500"
                                            />
                                            <div className="ml-2">
                                                <div className="font-semibold text-sm">{perm.slug}</div>
                                                <div className="text-xs text-slate-500">{perm.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Box>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions className="p-6 pt-2">
                    <Button onClick={handleClose} className="text-slate-500 hover:text-slate-700 px-6 rounded-xl">
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        className="bg-emerald-500 hover:bg-emerald-600 rounded-xl px-8 shadow-lg shadow-emerald-500/20"
                    >
                        Saqlash
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Roles;
