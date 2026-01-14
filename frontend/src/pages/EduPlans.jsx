import React, { useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useEduPlans, useCreateEduPlan, useUpdateEduPlan, useDeleteEduPlan } from '../hooks/useEduPlans';
import { useSpecialities } from '../hooks/useSpecialities';
import { Tooltip } from '@mui/material';

const EduPlans = () => {
    const navigate = useNavigate();
    const { data: eduPlans = [], isLoading } = useEduPlans();
    const { data: specialitiesData = { items: [] } } = useSpecialities();
    const specialities = specialitiesData.items || [];

    const createMutation = useCreateEduPlan();
    const updateMutation = useUpdateEduPlan();
    const deleteMutation = useDeleteEduPlan();

    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', speciality_id: '', is_active: true });

    const handleOpen = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                speciality_id: item.speciality_id,
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', speciality_id: '', is_active: true });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
        setFormData({ name: '', speciality_id: '', is_active: true });
    };

    const handleSubmit = () => {
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data: formData }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(formData, { onSuccess: handleClose });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <Box>
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    O'quv Rejalar (Edu Plans)
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} className="bg-emerald-500 hover:bg-emerald-600">
                    Qo'shish
                </Button>
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell className="font-bold">ID</TableCell>
                            <TableCell className="font-bold">Nomi</TableCell>
                            <TableCell className="font-bold">Mutaxassislik</TableCell>
                            <TableCell className="font-bold">Holat</TableCell>
                            <TableCell align="right" className="font-bold">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : eduPlans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Ma'lumot yo'q</TableCell>
                            </TableRow>
                        ) : (
                            eduPlans.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{specialities.find(s => s.id === item.speciality_id)?.name || item.speciality_id}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.is_active ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Yuklamalarni Ko'rish">
                                            <IconButton size="small" onClick={() => navigate(`/workloads?edu_plan_id=${item.id}`)} color="info"><VisibilityIcon /></IconButton>
                                        </Tooltip>
                                        <IconButton size="small" onClick={() => handleOpen(item)} color="primary"><EditIcon /></IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? "Tahrirlash" : "Yangi qo'shish"}</DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            select
                            label="Ta'lim Turi"
                            fullWidth
                            value={formData.education_type || ''}
                            onChange={(e) => setFormData({ ...formData, education_type: e.target.value, speciality_id: '' })}
                        >
                            <MenuItem value="Bakalavr">Bakalavr</MenuItem>
                            <MenuItem value="Magistr">Magistr</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Mutaxassislik"
                            fullWidth
                            value={formData.speciality_id}
                            onChange={(e) => setFormData({ ...formData, speciality_id: e.target.value })}
                            disabled={!formData.education_type}
                        >
                            {specialities
                                .filter(spec => !formData.education_type || spec.education_type === formData.education_type)
                                .map((spec) => (
                                    <MenuItem key={spec.id} value={spec.id}>
                                        {spec.name} ({spec.education_type})
                                    </MenuItem>
                                ))}
                        </TextField>
                        <FormControlLabel
                            control={<Switch checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />}
                            label="Faol"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Bekor qilish</Button>
                    <Button onClick={handleSubmit} variant="contained" className="bg-emerald-500">Saqlash</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EduPlans;
