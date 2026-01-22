import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, FormControl, InputLabel, Select, MenuItem,
    Box, Typography, Checkbox, FormControlLabel, Divider
} from '@mui/material';

/**
 * BatchCreateDialog - Yuklamalarni ommaviy yaratish dialogi.
 * Ma'ruza, Amaliyot, Lab va Seminar turlarini bir vaqtda yaratish imkonini beradi.
 */
const BatchCreateDialog = ({
    open,
    onClose,
    batchData,
    setBatchData,
    onSubmit,
    eduPlans = [],
    departments = [],
    subjects = [],
    streams = [],
    groups = []
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Yuklama Biriktirish (Batch)</DialogTitle>
            <DialogContent className="pt-4">
                <Box className="flex flex-col gap-4 mt-2">
                    {/* Asosiy maydonlar */}
                    <TextField
                        label="Yuklama Nomi"
                        fullWidth
                        value={batchData.name || ''}
                        onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>O'quv Reja (Edu Plan)</InputLabel>
                        <Select
                            value={batchData.edu_plan_id}
                            label="O'quv Reja (Edu Plan)"
                            onChange={(e) => setBatchData({ ...batchData, edu_plan_id: e.target.value })}
                        >
                            {eduPlans.map((ep) => (
                                <MenuItem key={ep.id} value={ep.id}>{ep.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box className="flex gap-4">
                        <FormControl fullWidth>
                            <InputLabel>Kafedra (Filter)</InputLabel>
                            <Select
                                value={batchData.department_id}
                                label="Kafedra (Filter)"
                                onChange={(e) => setBatchData({ ...batchData, department_id: e.target.value, subject_id: '' })}
                            >
                                <MenuItem value=""><em>Barchasi</em></MenuItem>
                                {departments.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Fan (Subject)</InputLabel>
                            <Select
                                value={batchData.subject_id}
                                label="Fan (Subject)"
                                onChange={(e) => setBatchData({ ...batchData, subject_id: e.target.value })}
                            >
                                {subjects
                                    .filter(s => !batchData.department_id || s.department_id === batchData.department_id)
                                    .map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider />
                    <Typography variant="subtitle1" fontWeight="bold">Mashg'ulot Turlari</Typography>

                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ma'ruza */}
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

                        {/* Amaliyot */}
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

                        {/* Laboratoriya */}
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
                                            {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name} {g.has_lab_subgroups && "(Bo'linadi)"}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        </Box>

                        {/* Seminar */}
                        <Box className="border rounded p-3 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                            <FormControlLabel
                                control={<Checkbox checked={batchData.hasSeminar} onChange={(e) => setBatchData({ ...batchData, hasSeminar: e.target.checked })} />}
                                label="Seminar"
                            />
                            {batchData.hasSeminar && (
                                <Box className="flex flex-col gap-2 mt-2">
                                    <TextField label="Soat" type="number" size="small" fullWidth value={batchData.seminarHours} onChange={(e) => setBatchData({ ...batchData, seminarHours: e.target.value })} />
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Guruhlar</InputLabel>
                                        <Select multiple value={batchData.seminarGroups} label="Guruhlar" onChange={(e) => setBatchData({ ...batchData, seminarGroups: e.target.value })} renderValue={(s) => s.length + ' ta tanlandi'}>
                                            {groups.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Bekor qilish</Button>
                <Button onClick={onSubmit} variant="contained" className="bg-emerald-600">Saqlash</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BatchCreateDialog;
