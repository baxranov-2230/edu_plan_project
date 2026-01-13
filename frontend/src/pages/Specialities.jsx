import React, { useState } from 'react';
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
    Select,
    Pagination,
    PaginationItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useSpecialities, useCreateSpeciality, useUpdateSpeciality, useDeleteSpeciality } from '../hooks/useSpecialities';
import { useDepartments } from '../hooks/useDepartments';
import useAuthStore from '../store/authStore';

const Specialities = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterEduType, setFilterEduType] = useState('');
    
    // Debounce search could be added here, but simple state passing for now
    const { data, isLoading: loading } = useSpecialities({ 
        page, 
        size, 
        search, 
        department_id: filterDept || undefined,
        education_type: filterEduType || undefined
    });
    
    const specialities = data?.items || [];
    const total = data?.total || 0;
    const items = data?.items || []; // items alias for check
    const { data: departments = [] } = useDepartments();


    const createMutation = useCreateSpeciality();
    const updateMutation = useUpdateSpeciality();
    const deleteMutation = useDeleteSpeciality();

    const { hasPermission } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [editingSpeciality, setEditingSpeciality] = useState(null);
    const [formData, setFormData] = useState({ name: '', department_id: '', education_type: '' });

    // Permissions (using generally available or specific permissions if defined)
    // Assuming reusing similar permission structure or general admin access for now
    const canCreate = hasPermission('department:create'); // Reusing department permissions or admin role
    const canUpdate = hasPermission('department:update');
    const canDelete = hasPermission('department:delete');

    const handleOpen = (speciality = null) => {
        if (speciality) {
            setEditingSpeciality(speciality);
            setFormData({
                name: speciality.name,
                department_id: speciality.department_id,
                education_type: speciality.education_type
            });
        } else {
            setEditingSpeciality(null);
            setFormData({ name: '', department_id: '', education_type: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSpeciality(null);
        setFormData({ name: '', department_id: '', education_type: '' });
    };

    const handleSubmit = async () => {
        if (!formData.department_id) {
            toast.error("Iltimos, kafedrani tanlang");
            return;
        }
        if (!formData.education_type) {
            toast.error("Iltimos, ta'lim turini tanlang");
            return;
        }

        if (editingSpeciality) {
            updateMutation.mutate({ id: editingSpeciality.id, data: formData }, {
                onSuccess: () => handleClose()
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => handleClose()
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatan ham bu mutaxassislikni o\'chirmoqchimisiz?')) {
            deleteMutation.mutate(id);
        }
    };

    const getDepartmentName = (deptId) => {
        const dept = departments.find(d => d.id === deptId);
        return dept ? dept.name : 'Noma\'lum';
    };

    return (
        <Box>
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    Mutaxassisliklar
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

            <Box className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <TextField
                        label="Qidirish"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Mutaxassislik nomini kiriting..."
                    />
                </div>
                
                <FormControl size="small" fullWidth>
                    <InputLabel>All Departments</InputLabel>
                    <Select
                        value={filterDept}
                        label="All Departments"
                        onChange={(e) => {
                            setFilterDept(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                    <InputLabel>All Education Types</InputLabel>
                    <Select
                        value={filterEduType}
                        label="All Education Types"
                        onChange={(e) => {
                            setFilterEduType(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        <MenuItem value="Bakalavr">Bakalavr</MenuItem>
                        <MenuItem value="Magistr">Magistr</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">ID</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Nomi</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Kafedra</TableCell>
                            <TableCell className="font-semibold text-slate-600 dark:text-slate-300">Ta'lim Turi</TableCell>
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
                        ) : specialities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="textSecondary">Ma'lumot mavjud emas</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            specialities.map((speciality) => (
                                <TableRow key={speciality.id} hover>
                                    <TableCell>{speciality.id}</TableCell>
                                    <TableCell className="font-medium">{speciality.name}</TableCell>
                                    <TableCell>{getDepartmentName(speciality.department_id)}</TableCell>
                                    <TableCell>{speciality.education_type}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpen(speciality)} color="primary">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(speciality.id)} color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                 <Box className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                         <Typography variant="body2" className="text-slate-500">
                             Sahifada:
                         </Typography>
                         <Select
                            value={size}
                            size="small"
                            onChange={(e) => {
                                setSize(e.target.value);
                                setPage(1);
                            }}
                            className="bg-white dark:bg-slate-700 h-8"
                         >
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                         </Select>
                         <Typography variant="body2" className="text-slate-500 ml-2">
                            Jami: {total}
                         </Typography>
                    </div>
                    
                    <Pagination 
                        count={Math.ceil(total / size) || 1} 
                        page={page} 
                        onChange={(e, p) => setPage(p)}
                        shape="rounded"
                        className="dark:text-white"
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                {...item}
                                sx={{
                                    '&.Mui-selected': {
                                        bgcolor: '#10b981', // emerald-500
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: '#059669', // emerald-600
                                        },
                                    },
                                    color: 'text.secondary'
                                }}
                            />
                        )}
                    />
                </Box>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingSpeciality ? "Mutaxassislikni o'zgartirish" : "Yangi mutaxassislik qo'shish"}</DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">
                        <FormControl fullWidth>
                            <InputLabel>Kafedra</InputLabel>
                            <Select
                                value={formData.department_id}
                                label="Kafedra"
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                         <FormControl fullWidth>
                            <InputLabel>Ta'lim Turi</InputLabel>
                            <Select
                                value={formData.education_type}
                                label="Ta'lim Turi"
                                onChange={(e) => setFormData({ ...formData, education_type: e.target.value })}
                            >
                                <MenuItem value="Bakalavr">Bakalavr</MenuItem>
                                <MenuItem value="Magistr">Magistr</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

export default Specialities;
