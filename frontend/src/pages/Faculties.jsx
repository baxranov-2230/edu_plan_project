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
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from '../hooks/useFaculties';
import useAuthStore from '../store/authStore';

const Faculties = () => {
    const { data: faculties = [], isLoading: loading } = useFaculties();
    const createMutation = useCreateFaculty();
    const updateMutation = useUpdateFaculty();
    const deleteMutation = useDeleteFaculty();

    const { hasPermission } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Removed useEffect for fetching, handled by useQuery

    // Define permissions check
    const canCreate = hasPermission('faculty:create');
    const canUpdate = hasPermission('faculty:update');
    const canDelete = hasPermission('faculty:delete');

    const handleOpen = (faculty = null) => {
        if (faculty) {
            setEditingFaculty(faculty);
            setFormData({ name: faculty.name, description: faculty.description || '' });
        } else {
            setEditingFaculty(null);
            setFormData({ name: '', description: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingFaculty(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async () => {
        if (editingFaculty) {
            updateMutation.mutate({ id: editingFaculty.id, data: formData }, {
                onSuccess: () => handleClose()
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => handleClose()
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <Box>
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    Fakultetlar
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
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Tavsif</TableCell>
                            <TableCell align="right" className="font-semibold text-slate-600 dark:text-slate-300">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : faculties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="textSecondary">Ma'lumot mavjud emas</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            faculties.map((faculty) => (
                                <TableRow key={faculty.id} hover>
                                    <TableCell>{faculty.id}</TableCell>
                                    <TableCell className="font-medium">{faculty.name}</TableCell>
                                    <TableCell>{faculty.description}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpen(faculty)} color="primary">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(faculty.id)} color="error">
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
                <DialogTitle>{editingFaculty ? "Fakultetni o'zgartirish" : "Yangi fakultet qo'shish"}</DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">
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

export default Faculties;
