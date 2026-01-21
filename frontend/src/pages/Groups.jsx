import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, MenuItem, FormControl, InputLabel, Select, Pagination, PaginationItem,
    Box, Typography, Chip, FormControlLabel, Checkbox
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from '../hooks/useGroups';
import { useSpecialities } from '../hooks/useSpecialities';

const Groups = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        speciality_id: '',
        course: 1,
        student_count: 0,
        education_shape: 'kunduzgi',
        has_lab_subgroups: false
    });

    const { data, isLoading } = useGroups({ page, size, search });
    const { data: specialitiesData } = useSpecialities({ page: 1, size: 100 });

    const createMutation = useCreateGroup();
    const updateMutation = useUpdateGroup();
    const deleteMutation = useDeleteGroup();

    const groups = data?.items || [];
    const total = data?.total || 0;
    const specialities = specialitiesData?.items || [];

    const handleOpen = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({
                name: item.name,
                speciality_id: item.speciality_id,
                course: item.course,
                student_count: item.student_count || 0,
                education_shape: item.education_shape || 'kunduzgi',
                has_lab_subgroups: item.has_lab_subgroups || false
            });
        } else {
            setEditItem(null);
            setFormData({
                name: '',
                speciality_id: '',
                course: 1,
                student_count: 0,
                education_shape: 'kunduzgi',
                has_lab_subgroups: false
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        const payload = { ...formData };
        payload.course = parseInt(payload.course);
        payload.student_count = parseInt(payload.student_count);

        if (editItem) {
            await updateMutation.mutateAsync({ id: editItem.id, data: payload });
        } else {
            await createMutation.mutateAsync(payload);
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
                    Guruhlar
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
                            <TableCell>Mutaxassislik</TableCell>
                            <TableCell>Kurs</TableCell>
                            <TableCell>Talaba Soni</TableCell>
                            <TableCell>Ta'lim Shakli</TableCell>
                            <TableCell>Lab. Bo'linadimi?</TableCell>
                            <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : groups.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.id}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    {specialities.find(s => s.id === item.speciality_id)?.name || item.speciality_id}
                                </TableCell>
                                <TableCell>
                                    <Chip label={`${item.course}-kurs`} size="small" color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell>{item.student_count}</TableCell>
                                <TableCell>
                                    <Chip label={item.education_shape} size="small" className="uppercase" />
                                </TableCell>
                                <TableCell>
                                    {item.has_lab_subgroups ? 'Ha' : 'Yo\'q'}
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
                    <Select
                        value={size}
                        size="small"
                        onChange={(e) => {
                            setSize(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                    <Pagination
                        count={Math.ceil(total / size) || 1}
                        page={page}
                        onChange={(e, p) => setPage(p)}
                        shape="rounded"
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                {...item}
                            />
                        )}
                    />
                </Box>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editItem ? 'Guruhni tahrirlash' : 'Yangi guruh'}</DialogTitle>
                <DialogContent className="pt-4">
                    <Box className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Kurs"
                            type="number"
                            fullWidth
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        />
                        <TextField
                            label="Talaba Soni"
                            type="number"
                            fullWidth
                            value={formData.student_count}
                            onChange={(e) => setFormData({ ...formData, student_count: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Ta'lim Shakli</InputLabel>
                            <Select
                                value={formData.education_shape}
                                label="Ta'lim Shakli"
                                onChange={(e) => setFormData({ ...formData, education_shape: e.target.value })}
                            >
                                <MenuItem value="kunduzgi">Kunduzgi</MenuItem>
                                <MenuItem value="kechki">Kechki</MenuItem>
                                <MenuItem value="sirtqi">Sirtqi</MenuItem>
                                <MenuItem value="masofaviy">Masofaviy</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Mutaxassislik</InputLabel>
                            <Select
                                value={formData.speciality_id}
                                label="Mutaxassislik"
                                onChange={(e) => setFormData({ ...formData, speciality_id: e.target.value })}
                            >
                                {specialities.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_lab_subgroups}
                                    onChange={(e) => setFormData({ ...formData, has_lab_subgroups: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Labaratoriya bo'linadimi?"
                        />
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

export default Groups;
