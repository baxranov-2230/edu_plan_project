import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, MenuItem, FormControl, InputLabel, Select, Pagination, PaginationItem,
    Box, Typography, Chip, FormControlLabel, Checkbox, FormGroup, FormLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '../hooks/useSubjects';
import { useDepartments } from '../hooks/useDepartments';

const Subjects = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        department_id: '',
        credits: 0,
        semesters: [] // Changed to array
    });

    const { data, isLoading } = useSubjects({ page, size, search });
    const { data: departmentsData } = useDepartments();
    const departments = Array.isArray(departmentsData) ? departmentsData : (departmentsData?.items || []);

    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();

    const items = data?.items || [];
    const total = data?.total || 0;

    const handleOpen = (item = null) => {
        if (item) {
            setEditItem(item);
            setFormData({
                name: item.name,
                department_id: item.department_id,
                credits: item.credits || 0,
                semesters: item.semesters || []
            });
        } else {
            setEditItem(null);
            setFormData({
                name: '',
                department_id: '',
                credits: 0,
                semesters: []
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSemesterChange = (event) => {
        const { value, checked } = event.target;
        setFormData(prev => {
            const newSemesters = checked
                ? [...prev.semesters, value]
                : prev.semesters.filter(s => s !== value);
            return { ...prev, semesters: newSemesters };
        });
    };

    const handleSubmit = async () => {
        const payload = { ...formData };
        payload.credits = parseInt(payload.credits);

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
                    Fanlar (Subjects)
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
                            <TableCell>Kredit</TableCell>
                            <TableCell>Semestrlar</TableCell>
                            <TableCell>Kafedra</TableCell>
                            <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : items.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.id}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    <Chip label={item.credits} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Box className="flex gap-1">
                                        {item.semesters && item.semesters.map(sem => (
                                            <Chip
                                                key={sem}
                                                label={sem === 'kuzgi' ? 'Kuzgi' : sem === 'bahorgi' ? 'Bahorgi' : sem}
                                                color={sem === 'kuzgi' ? 'warning' : 'success'}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
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
                <DialogTitle>{editItem ? 'Fanni tahrirlash' : 'Yangi fan'}</DialogTitle>
                <DialogContent className="pt-4">
                    <Box className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Kredit (ECTS)"
                            type="number"
                            fullWidth
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Semestrlar</FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.semesters.includes('kuzgi')}
                                            onChange={handleSemesterChange}
                                            value="kuzgi"
                                        />
                                    }
                                    label="Kuzgi"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.semesters.includes('bahorgi')}
                                            onChange={handleSemesterChange}
                                            value="bahorgi"
                                        />
                                    }
                                    label="Bahorgi"
                                />
                            </FormGroup>
                            <Typography variant="caption" className="text-gray-500 mt-2 block">
                                Also accepts numbers like 1, 2, 3... (Manual input TBD)
                            </Typography>
                        </FormControl>

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

export default Subjects;
