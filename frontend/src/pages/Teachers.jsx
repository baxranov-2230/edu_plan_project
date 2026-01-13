import React, { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    CircularProgress, MenuItem, FormControl, InputLabel, Select, Pagination, PaginationItem,
    Box, Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '../hooks/useTeachers';
import { useDepartments } from '../hooks/useDepartments';
// Assuming useUsers hook exists or creates basic User selector
// For now, I will assume a useUsers hook is needed. I'll mock it or create it if missing, but likely Users logic is distinct.
// I will just use text input for User ID for MVP or try to use a mock list. 
// Ideally I should fetch users. I'll omit useUsers for now and just use ID input to avoid blocking, 
// or better, I'll add useUsers later. I'll stick to ID input for now.

const Teachers = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({ user_id: '', department_id: '' });

    const { data, isLoading } = useTeachers({ page, size });
    const { data: departments=[] } = useDepartments();
    
    const createMutation = useCreateTeacher();
    const updateMutation = useUpdateTeacher();
    const deleteMutation = useDeleteTeacher();

    const items = data?.items || [];
    const total = data?.total || 0;

    const handleOpen = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({ user_id: item.user_id, department_id: item.department_id });
        } else {
            setEditItem(null);
            setFormData({ user_id: '', department_id: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (editItem) {
            await updateMutation.mutateAsync({ id: editItem.id, data: formData });
        } else {
            await createMutation.mutateAsync(formData);
        }
        handleClose();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="p-6">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    O'qituvchilar Profile
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    Qo'shish
                </Button>
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Kafedra</TableCell>
                            <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : items.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.user_id}</TableCell> 
                                <TableCell>
                                    {departments.find(d => d.id === item.department_id)?.name || item.department_id}
                                </TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => handleOpen(item)}><EditIcon fontSize="small" /></Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(item.id)}><DeleteIcon fontSize="small" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                 <Box className="p-4 flex items-center justify-between border-t border-slate-200">
                     <Pagination 
                        count={Math.ceil(total / size) || 1} 
                        page={page} 
                        onChange={(e, p) => setPage(p)}
                        shape="rounded"
                        className="ml-auto"
                    />
                </Box>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editItem ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi'}</DialogTitle>
                <DialogContent className="pt-4">
                    <Box className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="User ID"
                            type="number"
                            fullWidth
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            helperText="Foydalanuvchi ID raqamini kiriting (Vaqtinchalik)"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Kafedra</InputLabel>
                            <Select
                                value={formData.department_id}
                                label="Kafedra"
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            >
                                {departments.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Bekor qilish</Button>
                    <Button onClick={handleSubmit} variant="contained" className="bg-emerald-600">Saqlash</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Teachers;
