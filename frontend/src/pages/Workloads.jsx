import React, { useState, useMemo } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    CircularProgress, MenuItem, FormControl, InputLabel, Select, Pagination, PaginationItem,
    Box, Typography, Chip, Checkbox, FormControlLabel, FormGroup, FormLabel, Divider,
    Grid, IconButton, Tooltip, Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';

import { useWorkloads, useCreateBatchWorkload, useDeleteWorkload, useUpdateWorkload, useUpdateWorkloadGroup, useDeleteWorkloadGroup } from '../hooks/useWorkloads';
import { useCurriculums } from '../hooks/useCurriculums';
import { useStreams } from '../hooks/useStreams';
import { useGroups } from '../hooks/useGroups';

const Row = ({ row, onDelete, onEdit, onGroupEdit, onGroupDelete }) => {
    const [open, setOpen] = useState(false);
    
    // Aggregates
    const lectureHours = row.items.filter(i => i.load_type === 'lecture').reduce((sum, i) => sum + i.hours, 0);
    const practiceHours = row.items.filter(i => i.load_type === 'practice').reduce((sum, i) => sum + i.hours, 0);
    const labHours = row.items.filter(i => i.load_type === 'lab').reduce((sum, i) => sum + i.hours, 0);
    const totalHours = lectureHours + practiceHours + labHours;

    // Get unique targets
    const renderTargets = () => {
        const targets = [];
        row.items.forEach(item => {
            if (item.stream) targets.push({ type: 'stream', id: item.stream.id, name: item.stream.name });
            if (item.group) targets.push({ type: 'group', id: item.group.id, name: item.group.name });
            if (item.subgroup) targets.push({ type: 'subgroup', id: item.subgroup.id, name: item.subgroup.name });
        });
        
        // Remove duplicates roughly
        const unique = [];
        const seen = new Set();
        targets.forEach(t => {
            const key = `${t.type}-${t.id}`;
            if(!seen.has(key)) {
                seen.add(key);
                unique.push(t);
            }
        });

        // Limit display
        return (
            <Box className="flex flex-wrap gap-1">
                {unique.slice(0, 3).map((t, idx) => (
                    <Chip 
                        key={`${t.type}-${t.id}-${idx}`} 
                        label={`${t.type === 'stream' ? 'Potok' : t.type === 'group' ? 'Guruh' : 'Guruhcha'}: ${t.name}`} 
                        size="small" 
                        variant="outlined" 
                        color={t.type === 'stream' ? 'primary' : t.type === 'group' ? 'secondary' : 'success'}
                    />
                ))}
                {unique.length > 3 && <Chip label={`+${unique.length - 3}`} size="small" variant="outlined" />}
            </Box>
        );
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover className="cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                 <TableCell width={50}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" onClick={() => setOpen(!open)}>
                    <Box className="flex items-center gap-2">
                        <Box>
                            <Typography fontWeight="bold" className="text-slate-700 dark:text-slate-200">{row.curriculum_name}</Typography>
                            {row.name && <Typography variant="caption" className="text-slate-500 dark:text-slate-400 font-medium">{row.name}</Typography>}
                        </Box>
                        <Tooltip title="Guruhni Tahrirlash (Global Update)">
                             <IconButton size="small" onClick={(e) => { e.stopPropagation(); onGroupEdit(row); }} className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Guruhni O'chirish (Batch Delete)">
                             <IconButton size="small" onClick={(e) => { e.stopPropagation(); onGroupDelete(row); }} className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Chip label={`${totalHours} soat`} color="default" size="small" className="bg-slate-200 text-slate-700 font-bold dark:bg-slate-700 dark:text-slate-200" />
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {lectureHours > 0 ? <Chip label={`${lectureHours} soat`} color="primary" size="small" className="bg-blue-50 text-blue-700 font-bold border-none dark:bg-blue-900/30 dark:text-blue-300" /> : '-'}
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {practiceHours > 0 ? <Chip label={`${practiceHours} soat`} color="secondary" size="small" className="bg-purple-50 text-purple-700 font-bold border-none dark:bg-purple-900/30 dark:text-purple-300" /> : '-'}
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {labHours > 0 ? <Chip label={`${labHours} soat`} color="success" size="small" className="bg-green-50 text-green-700 font-bold border-none dark:bg-green-900/30 dark:text-green-300" /> : '-'}
                </TableCell>
                <TableCell onClick={() => setOpen(!open)}>
                    {renderTargets()}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, marginLeft: 6 }}>
                             <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Turi</TableCell>
                                        <TableCell>Target</TableCell>
                                        <TableCell align="right">Soat</TableCell>
                                        <TableCell align="right">Amallar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row" className="text-slate-500 dark:text-slate-400">{item.id}</TableCell>
                                            <TableCell className="uppercase text-xs font-bold">{item.load_type}</TableCell>
                                            <TableCell>
                                                {item.stream ? <Chip label={`Potok: ${item.stream.name}`} size="small" variant='outlined' color='primary'/> : 
                                                 item.group ? <Chip label={`Guruh: ${item.group.name}`} size="small" variant='outlined' color='secondary'/> : 
                                                 item.subgroup ? <Chip label={`Guruhcha: ${item.subgroup.name}`} size="small" variant='outlined' /> : '-'}
                                            </TableCell>
                                            <TableCell align="right">{item.hours}</TableCell>
                                            <TableCell align="right">
                                                 <Tooltip title="O'chirish">
                                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Tahrirlash">
                                                    <IconButton size="small" color="warning" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const Workloads = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(100); 
    const [openBatch, setOpenBatch] = useState(false);
    
    // Edit States
    const [openEdit, setOpenEdit] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editData, setEditData] = useState({});

    // Group Edit States
    const [openGroupEdit, setOpenGroupEdit] = useState(false);
    const [groupEditItem, setGroupEditItem] = useState(null);
    const [groupEditData, setGroupEditData] = useState({ new_curriculum_id: '', new_name: '' });

    // Data Hooks
    const { data: workloadsData, isLoading } = useWorkloads({ page, size });
    const { data: curriculumsData } = useCurriculums({ size: 100 });
    const { data: streamsData } = useStreams({ size: 100 });
    const { data: groupsData } = useGroups({ size: 100 });

    const createBatchMutation = useCreateBatchWorkload();
    const updateMutation = useUpdateWorkload();
    const updateGroupMutation = useUpdateWorkloadGroup();
    const deleteMutation = useDeleteWorkload();
    const deleteGroupMutation = useDeleteWorkloadGroup();

    const workloads = workloadsData?.items || [];
    const total = workloadsData?.total || 0;
    
    const curriculums = curriculumsData?.items || [];
    const streams = streamsData?.items || [];
    const groups = groupsData?.items || [];

    // --- Aggregation Logic ---
    const groupedWorkloads = useMemo(() => {
        const groups = {};
        workloads.forEach(item => {
            const key = item.curriculum_id; 
            if (!groups[key]) {
                groups[key] = {
                    curriculum_id: item.curriculum_id,
                    curriculum_name: item.curriculum?.name || `Fan ID: ${item.curriculum_id}`,
                    name: item.name, 
                    items: []
                };
            }
            groups[key].items.push(item);
        });
        return Object.values(groups);
    }, [workloads]);

    // --- Batch Create ---
    const [batchData, setBatchData] = useState({
        curriculum_id: '',
        semester: 'kuzgi',
        name: '', 
        hasLecture: false, hasPractice: false, hasLab: false,
        lectureHours: 0, lectureStreams: [],
        practiceHours: 0, practiceGroups: [],
        labHours: 0, labGroups: [],
    });

    const handleOpenBatch = () => {
        setBatchData({
            curriculum_id: '', semester: 'kuzgi', name: '',
            hasLecture: false, hasPractice: false, hasLab: false,
            lectureHours: 0, lectureStreams: [],
            practiceHours: 0, practiceGroups: [],
            labHours: 0, labGroups: [],
        });
        setOpenBatch(true);
    };

    const handleBatchSubmit = async () => {
        const items = [];
        if (batchData.hasLecture && batchData.lectureHours > 0 && batchData.lectureStreams.length > 0) {
            items.push({ load_type: 'lecture', hours: parseInt(batchData.lectureHours), stream_ids: batchData.lectureStreams, group_ids: [] });
        }
        if (batchData.hasPractice && batchData.practiceHours > 0 && batchData.practiceGroups.length > 0) {
            items.push({ load_type: 'practice', hours: parseInt(batchData.practiceHours), stream_ids: [], group_ids: batchData.practiceGroups });
        }
        if (batchData.hasLab && batchData.labHours > 0 && batchData.labGroups.length > 0) {
            items.push({ load_type: 'lab', hours: parseInt(batchData.labHours), stream_ids: [], group_ids: batchData.labGroups });
        }
        if (items.length === 0) return alert("Kamida bitta yuklama turini tanlang.");

        await createBatchMutation.mutateAsync({ 
            curriculum_id: batchData.curriculum_id, 
            name: batchData.name,
            items: items 
        });
        setOpenBatch(false);
    };

    // --- Single Edit ---
    const handleOpenEdit = (item) => {
        setEditItem(item);
        setEditData({
            curriculum_id: item.curriculum_id,
            load_type: item.load_type,
            hours: item.hours,
            name: item.name || '',
            stream_id: item.stream_id || '',
            group_id: item.group_id || '',
        });
        setOpenEdit(true);
    };

    const handleEditSubmit = async () => {
        const payload = { ...editData };
        payload.hours = parseInt(payload.hours);
        if (!payload.stream_id) payload.stream_id = null;
        if (!payload.group_id) payload.group_id = null;

        await updateMutation.mutateAsync({ id: editItem.id, data: payload });
        setOpenEdit(false);
    };

    // --- Group Edit ---
    const handleOpenGroupEdit = (groupRow) => {
        setGroupEditItem(groupRow);
        setGroupEditData({
            new_curriculum_id: groupRow.curriculum_id,
            new_name: groupRow.name || ''
        });
        setOpenGroupEdit(true);
    };

    const handleGroupEditSubmit = async () => {
        const payload = { 
            curriculum_id: groupEditItem.curriculum_id 
        };
        // Only include if changed to avoid unnecessary updates if possible, 
        // but backend logic handles it. 
        payload.new_curriculum_id = groupEditData.new_curriculum_id;
        payload.new_name = groupEditData.new_name;

        await updateGroupMutation.mutateAsync(payload);
        setOpenGroupEdit(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('O\'chirishni tasdiqlaysizmi?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleGroupDelete = async (row) => {
        if (window.confirm(`"${row.curriculum_name}" dagi BARCHA yuklamalarni o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`)) {
            await deleteGroupMutation.mutateAsync(row.curriculum_id);
        }
    };
    
    return (
        <div className="p-6">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    Yuklamalar (Workloads)
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={handleOpenBatch}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    Yuklama Biriktirish
                </Button>
            </Box>

            <TableContainer component={Paper} className="shadow-sm rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableCell width={50} />
                            <TableCell>Fan (Subject)</TableCell>
                            <TableCell align="center">Jami Soat</TableCell>
                            <TableCell align="center">Ma'ruza (Lec)</TableCell>
                            <TableCell align="center">Amaliyot (Prac)</TableCell>
                            <TableCell align="center">Lab (Lab)</TableCell>
                            <TableCell>Targetlar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : groupedWorkloads.map((row) => (
                            <Row 
                                key={row.curriculum_id} 
                                row={row} 
                                onDelete={handleDelete}
                                onEdit={handleOpenEdit}
                                onGroupEdit={handleOpenGroupEdit}
                                onGroupDelete={handleGroupDelete}
                            />
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

            {/* --- Batch Create Dialog --- */}
            <Dialog open={openBatch} onClose={() => setOpenBatch(false)} maxWidth="md" fullWidth>
                <DialogTitle>Yuklama Biriktirish (Batch)</DialogTitle>
                <DialogContent className="pt-4">
                     <Box className="flex flex-col gap-4 mt-2">
                         <Box className="flex gap-4">
                            <FormControl fullWidth>
                                <InputLabel>Fan (Curriculum)</InputLabel>
                                <Select
                                    value={batchData.curriculum_id}
                                    label="Fan (Curriculum)"
                                    onChange={(e) => setBatchData({ ...batchData, curriculum_id: e.target.value })}
                                >
                                    {curriculums.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Yuklama Nomi (Ixtiyoriy)"
                                placeholder="Masalan: Kuzgi Semestr Matematika"
                                fullWidth
                                value={batchData.name}
                                onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                            />
                         </Box>
                         <Divider />
                        {/* Types Inputs (Similar to previous, keeping concise here) */}
                        {/* In real code, keeping inputs is crucial. Assuming they are preserved or I should re-include them fully if replacing file. */}
                        {/* RE-INCLUDING FULL BATCH FORM TO BE SAFE */}
                        <Typography variant="subtitle1" fontWeight="bold">Mashg'ulot Turlari</Typography>
                        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Lecture */}
                            <Box className="border rounded p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                                <FormControlLabel
                                    control={<Checkbox checked={batchData.hasLecture} onChange={(e) => setBatchData({ ...batchData, hasLecture: e.target.checked })} />}
                                    label="Ma'ruza"
                                />
                                {batchData.hasLecture && (
                                    <Box className="flex flex-col gap-2 mt-2">
                                        <TextField label="Soat" type="number" size="small" fullWidth value={batchData.lectureHours} onChange={(e) => setBatchData({ ...batchData, lectureHours: e.target.value })} />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Potoklar</InputLabel>
                                            <Select multiple value={batchData.lectureStreams} label="Potoklar" onChange={(e) => setBatchData({ ...batchData, lectureStreams: e.target.value })} renderValue={(s) => s.length + ' ta tanlandi'}>
                                                {streams.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </Box>
                             {/* Practice */}
                            <Box className="border rounded p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                                <FormControlLabel
                                    control={<Checkbox checked={batchData.hasPractice} onChange={(e) => setBatchData({ ...batchData, hasPractice: e.target.checked })} />}
                                    label="Amaliyot"
                                />
                                {batchData.hasPractice && (
                                    <Box className="flex flex-col gap-2 mt-2">
                                        <TextField label="Soat" type="number" size="small" fullWidth value={batchData.practiceHours} onChange={(e) => setBatchData({ ...batchData, practiceHours: e.target.value })} />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Guruhlar</InputLabel>
                                            <Select multiple value={batchData.practiceGroups} label="Guruhlar" onChange={(e) => setBatchData({ ...batchData, practiceGroups: e.target.value })} renderValue={(s) => s.length + ' ta tanlandi'}>
                                                {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </Box>
                             {/* Lab */}
                            <Box className="border rounded p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                                <FormControlLabel
                                    control={<Checkbox checked={batchData.hasLab} onChange={(e) => setBatchData({ ...batchData, hasLab: e.target.checked })} />}
                                    label="Laboratoriya"
                                />
                                {batchData.hasLab && (
                                    <Box className="flex flex-col gap-2 mt-2">
                                        <TextField label="Soat" type="number" size="small" fullWidth value={batchData.labHours} onChange={(e) => setBatchData({ ...batchData, labHours: e.target.value })} />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Guruhlar</InputLabel>
                                            <Select multiple value={batchData.labGroups} label="Guruhlar" onChange={(e) => setBatchData({ ...batchData, labGroups: e.target.value })} renderValue={(s) => s.length + ' ta tanlandi'}>
                                                {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name} {g.he_lab_split && '(Bo\'linadi)'}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                     </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBatch(false)}>Bekor qilish</Button>
                    <Button onClick={handleBatchSubmit} variant="contained" className="bg-emerald-600">Saqlash</Button>
                </DialogActions>
            </Dialog>

            {/* --- Edit Dialog (Single Item) --- */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Yuklamani Tahrirlash</DialogTitle>
                <DialogContent className="pt-4">
                    <Box className="flex flex-col gap-4 mt-2">
                         <FormControl fullWidth>
                            <InputLabel>Fan (Curriculum)</InputLabel>
                            <Select
                                value={editData.curriculum_id}
                                label="Fan (Curriculum)"
                                onChange={(e) => setEditData({ ...editData, curriculum_id: e.target.value })}
                            >
                                {curriculums.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Nomi"
                            fullWidth
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                         {/* Other inputs... */}
                         <FormControl fullWidth>
                            <InputLabel>Turi</InputLabel>
                            <Select
                                value={editData.load_type}
                                label="Turi"
                                onChange={(e) => setEditData({ ...editData, load_type: e.target.value })}
                            >
                                <MenuItem value="lecture">Ma'ruza</MenuItem>
                                <MenuItem value="practice">Amaliyot</MenuItem>
                                <MenuItem value="lab">Laboratoriya</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Soat"
                            type="number"
                            fullWidth
                            value={editData.hours}
                            onChange={(e) => setEditData({ ...editData, hours: e.target.value })}
                        />
                         {editData.load_type === 'lecture' ? (
                             <FormControl fullWidth>
                                <InputLabel>Potok</InputLabel>
                                <Select
                                    value={editData.stream_id}
                                    label="Potok"
                                    onChange={(e) => setEditData({ ...editData, stream_id: e.target.value })}
                                >
                                     <MenuItem value=""><em>Tanlanmagan</em></MenuItem>
                                    {streams.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                             <FormControl fullWidth>
                                <InputLabel>Guruh</InputLabel>
                                <Select
                                    value={editData.group_id}
                                    label="Guruh"
                                    onChange={(e) => setEditData({ ...editData, group_id: e.target.value })}
                                >
                                    <MenuItem value=""><em>Tanlanmagan</em></MenuItem>
                                    {groups.map((g) => (
                                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Bekor qilish</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="warning">Yangilash</Button>
                </DialogActions>
            </Dialog>

             {/* --- Group Update Dialog --- */}
             <Dialog open={openGroupEdit} onClose={() => setOpenGroupEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Guruhni Tahrirlash (Umumiy)</DialogTitle>
                <DialogContent className="pt-4">
                     <Typography variant="body2" className="text-slate-500 mb-4">
                        Bu o'zgarish shu fandagi barcha ({groupEditItem?.items?.length}) yuklamalarga ta'sir qiladi.
                    </Typography>
                    <Box className="flex flex-col gap-4 mt-2">
                        <TextField
                            label="Yuklama Nomi"
                            fullWidth
                            value={groupEditData.new_name}
                            onChange={(e) => setGroupEditData({ ...groupEditData, new_name: e.target.value })}
                        />
                         <FormControl fullWidth>
                            <InputLabel>Fan (Curriculum)</InputLabel>
                            <Select
                                value={groupEditData.new_curriculum_id}
                                label="Fan (Curriculum)"
                                onChange={(e) => setGroupEditData({ ...groupEditData, new_curriculum_id: e.target.value })}
                            >
                                {curriculums.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGroupEdit(false)}>Bekor qilish</Button>
                    <Button onClick={handleGroupEditSubmit} variant="contained" color="primary">Barchasini Yangilash</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Workloads;
