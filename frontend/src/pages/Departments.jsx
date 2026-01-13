import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '../hooks/useDepartments';
import { useFaculties } from '../hooks/useFaculties';
import useAuthStore from '../store/authStore';

const Departments = () => {
    const { data: departments = [], isLoading: loading } = useDepartments();
    const { data: faculties = [] } = useFaculties();

    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment();
    const deleteMutation = useDeleteDepartment();

    const { hasPermission } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', faculty_id: '' });

    // Removed useEffect fetching

    // Define permissions check
    const canCreate = hasPermission('department:create');
    const canUpdate = hasPermission('department:update');
    const canDelete = hasPermission('department:delete');

    const handleOpen = (department = null) => {
        if (department) {
            setEditingDepartment(department);
            setFormData({
                name: department.name,
                description: department.description || '',
                faculty_id: department.faculty_id
            });
        } else {
            setEditingDepartment(null);
            setFormData({ name: '', description: '', faculty_id: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingDepartment(null);
        setFormData({ name: '', description: '', faculty_id: '' });
    };

    const handleSubmit = async () => {
        if (!formData.faculty_id) {
            toast.error("Iltimos, fakultetni tanlang");
            return;
        }

        if (editingDepartment) {
            updateMutation.mutate({ id: editingDepartment.id, data: formData }, {
                onSuccess: () => handleClose()
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => handleClose()
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatan ham bu kafedrani o\'chirmoqchimisiz?')) {
            deleteMutation.mutate(id);
        }
    };

    const getFacultyName = (facultyId) => {
        const faculty = faculties.find(f => f.id === facultyId);
        return faculty ? faculty.name : 'Noma\'lum';
    };

    return (
        <Box>
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    Kafedralar
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    className="bg-emerald-500 hover:bg-emerald-600"
                >
                    Qo'shish
                </Button>
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">ID</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Nomi</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Fakultet</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Tavsif</TableCell>
                            <TableCell align="right" className="font-semibold text-slate-600 dark:text-slate-300">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : departments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="textSecondary">Ma'lumot mavjud emas</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            departments.map((department) => (
                                <TableRow key={department.id} hover>
                                    <TableCell>{department.id}</TableCell>
                                    <TableCell className="font-medium">{department.name}</TableCell>
                                    <TableCell>{getFacultyName(department.faculty_id)}</TableCell>
                                    <TableCell>{department.description}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpen(department)} color="primary">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(department.id)} color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingDepartment ? "Kafedrani o'zgartirish" : "Yangi kafedra qo'shish"}</DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">
                        <FormControl fullWidth>
                            <InputLabel>Fakultet</InputLabel>
                            <Select
                                value={formData.faculty_id}
                                label="Fakultet"
                                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                            >
                                {faculties.map((faculty) => (
                                    <MenuItem key={faculty.id} value={faculty.id}>
                                        {faculty.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Tavsif"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Bekor qilish</Button>
                    <Button onClick={handleSubmit} variant="contained" className="bg-emerald-500 hover:bg-emerald-600">
                        Saqlash
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Departments;
