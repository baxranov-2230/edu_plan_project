import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';

/**
 * EditWorkloadDialog - Bitta yuklamani tahrirlash dialogi.
 */
const EditWorkloadDialog = ({
    open,
    onClose,
    editData,
    setEditData,
    onSubmit,
    subjects = [],
    streams = [],
    groups = []
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Yuklamani Tahrirlash</DialogTitle>
            <DialogContent className="pt-4">
                <Box className="flex flex-col gap-4 mt-2">
                    <FormControl fullWidth>
                        <InputLabel>Fan (Subject)</InputLabel>
                        <Select
                            value={editData.subject_id}
                            label="Fan (Subject)"
                            onChange={(e) => setEditData({ ...editData, subject_id: e.target.value })}
                        >
                            {subjects.map((c) => (
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
                <Button onClick={onClose}>Bekor qilish</Button>
                <Button onClick={onSubmit} variant="contained" color="warning">Yangilash</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditWorkloadDialog;
