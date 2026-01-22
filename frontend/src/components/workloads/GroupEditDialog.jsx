import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, MenuItem, Box, Typography
} from '@mui/material';

/**
 * GroupEditDialog - Guruh yuklamalarini umumiy tahrirlash dialogi.
 * Bitta fandagi barcha yuklamalarga ta'sir qiladi.
 */
const GroupEditDialog = ({
    open,
    onClose,
    groupEditData,
    setGroupEditData,
    onSubmit,
    workloadsCount = 0,
    eduPlans = [],
    departments = [],
    subjects = []
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Guruhni Tahrirlash (Umumiy)</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Bu o'zgarish shu fandagi barcha ({workloadsCount}) yuklamalarga ta'sir qiladi.
                </Typography>
                <Box className="flex flex-col gap-4">
                    <TextField
                        label="Yuklama Nomi"
                        fullWidth
                        value={groupEditData.new_name}
                        onChange={(e) => setGroupEditData({ ...groupEditData, new_name: e.target.value })}
                    />
                    <TextField
                        select
                        label="O'quv Reja (Edu Plan)"
                        fullWidth
                        value={groupEditData.new_edu_plan_id || ''}
                        onChange={(e) => setGroupEditData({ ...groupEditData, new_edu_plan_id: e.target.value })}
                    >
                        <MenuItem value="">Tanlanmagan</MenuItem>
                        {eduPlans.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Kafedra (Filtr)"
                        fullWidth
                        value={groupEditData.department_id || ''}
                        onChange={(e) => setGroupEditData({ ...groupEditData, department_id: e.target.value })}
                        helperText="Fanlarni filtrlash uchun kafedrani tanlang"
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Fan (Subject)"
                        fullWidth
                        value={groupEditData.new_subject_id || ''}
                        onChange={(e) => setGroupEditData({ ...groupEditData, new_subject_id: e.target.value })}
                    >
                        {subjects
                            .filter(subject => !groupEditData.department_id || subject.department_id === groupEditData.department_id)
                            .map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Bekor qilish</Button>
                <Button onClick={onSubmit} variant="contained" className="bg-emerald-600">Barchasini Yangilash</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupEditDialog;
