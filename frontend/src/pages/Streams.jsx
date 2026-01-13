import React, { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    CircularProgress, MenuItem, FormControl, InputLabel, Select, Pagination, PaginationItem,
    Box, Typography, Chip, OutlinedInput
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useStreams, useCreateStream, useUpdateStream, useDeleteStream } from '../hooks/useStreams';
import { useGroups } from '../hooks/useGroups';

const Streams = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', academic_year: '2025-2026', group_ids: [] });

    const { data, isLoading } = useStreams({ page, size, search });
    const { data: groupsData } = useGroups({ page: 1, size: 100 });
    
    const createMutation = useCreateStream();
    const updateMutation = useUpdateStream();
    const deleteMutation = useDeleteStream();

    const items = data?.items || [];
    const total = data?.total || 0;
    const groups = groupsData?.items || [];

    const handleOpen = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({ 
                name: item.name, 
                academic_year: item.academic_year, 
                group_ids: item.groups ? item.groups.map(g => g.id) : [] 
            });
        } else {
            setEditItem(null);
            setFormData({ name: '', academic_year: '2025-2026', group_ids: [] });
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
                    Potoklar (Streams)
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

            <Box className="mb-4">
                <TextField
                    label="Qidirish"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nomi</TableCell>
                            <TableCell>O'quv Yili</TableCell>
                            <TableCell>Guruhlar</TableCell>
                            <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : items.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.id}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.academic_year}</TableCell>
                                <TableCell>
                                    {item.groups && item.groups.map(g => (
                                        <Chip key={g.id} label={g.name} size="small" className="mr-1 mb-1" />
                                    ))}
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
                <DialogTitle>{editItem ? 'Potokni tahrirlash' : 'Yangi potok'}</DialogTitle>
                <DialogContent className="pt-4">
                    <Box className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="O'quv Yili"
                            fullWidth
                            value={formData.academic_year}
                            onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Guruhlar</InputLabel>
                            <Select
                                multiple
                                value={formData.group_ids}
                                onChange={(e) => setFormData({ ...formData, group_ids: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                                input={<OutlinedInput label="Guruhlar" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                             const group = groups.find(g => g.id === value);
                                             return <Chip key={value} label={group ? group.name : value} />;
                                        })}
                                    </Box>
                                )}
                            >
                                {groups.map((g) => (
                                    <MenuItem key={g.id} value={g.id}>
                                        {g.name}
                                    </MenuItem>
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

export default Streams;
