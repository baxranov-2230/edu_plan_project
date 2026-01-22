import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, CircularProgress, Pagination, Box, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';

// Hooks
import { useWorkloads, useCreateBatchWorkload, useDeleteWorkload, useUpdateWorkload, useUpdateWorkloadGroup, useDeleteWorkloadGroup } from '../hooks/useWorkloads';
import { useSubjects } from '../hooks/useSubjects';
import { useStreams } from '../hooks/useStreams';
import { useGroups } from '../hooks/useGroups';
import { useEduPlans } from '../hooks/useEduPlans';
import { useDepartments } from '../hooks/useDepartments';

// Components
import { WorkloadRow, BatchCreateDialog, EditWorkloadDialog, GroupEditDialog } from '../components/workloads';

/**
 * Workloads sahifasi - Yuklamalarni boshqarish.
 * Refaktor qilingan versiya - komponentlar alohida fayllarga ajratilgan.
 */
const Workloads = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(100);
    const [openBatch, setOpenBatch] = useState(false);

    // URL Params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eduPlanIdParam = queryParams.get('edu_plan_id');

    // Edit States
    const [openEdit, setOpenEdit] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editData, setEditData] = useState({});

    // Group Edit States
    const [openGroupEdit, setOpenGroupEdit] = useState(false);
    const [groupEditItem, setGroupEditItem] = useState(null);
    const [groupEditData, setGroupEditData] = useState({ new_subject_id: '', new_name: '', department_id: '', new_edu_plan_id: '' });

    // Batch Edit Context
    const [editingBatchRow, setEditingBatchRow] = useState(null);

    // Data Hooks
    const { data: workloadsData, isLoading } = useWorkloads({ page, size, edu_plan_id: eduPlanIdParam });
    const { data: subjectsData } = useSubjects({ size: 100 });
    const { data: streamsData } = useStreams({ size: 100 });
    const { data: groupsData } = useGroups({ size: 100 });
    const { data: eduPlans = [] } = useEduPlans();
    const { data: departmentsData } = useDepartments({ size: 100 });

    // Extract items
    const departments = Array.isArray(departmentsData) ? departmentsData : departmentsData?.items || [];
    const workloads = workloadsData?.items || [];
    const total = workloadsData?.total || 0;
    const subjects = subjectsData?.items || [];
    const streams = streamsData?.items || [];
    const groups = groupsData?.items || [];

    // Mutations
    const createBatchMutation = useCreateBatchWorkload();
    const updateMutation = useUpdateWorkload();
    const updateGroupMutation = useUpdateWorkloadGroup();
    const deleteMutation = useDeleteWorkload();
    const deleteGroupMutation = useDeleteWorkloadGroup();

    // Aggregation Logic
    const groupedWorkloads = useMemo(() => {
        const grouped = {};
        workloads.forEach(item => {
            const key = item.subject_id;
            if (!grouped[key]) {
                grouped[key] = {
                    subject_id: item.subject_id,
                    subject_name: item.subject?.name || `Fan ID: ${item.subject_id}`,
                    name: item.name,
                    items: []
                };
            }
            grouped[key].items.push(item);
        });
        return Object.values(grouped);
    }, [workloads]);

    // Batch Data State
    const [batchData, setBatchData] = useState({
        edu_plan_id: '', department_id: '', subject_id: '', semester: 'kuzgi', name: '',
        hasLecture: false, hasPractice: false, hasLab: false, hasSeminar: false,
        lectureHours: 0, lectureStreams: [],
        practiceHours: 0, practiceGroups: [],
        labHours: 0, labGroups: [],
        seminarHours: 0, seminarGroups: [],
    });

    // Handlers
    const handleOpenBatch = () => {
        setBatchData({
            edu_plan_id: '', department_id: '', subject_id: '', semester: 'kuzgi', name: '',
            hasLecture: false, hasPractice: false, hasLab: false, hasSeminar: false,
            lectureHours: 0, lectureStreams: [],
            practiceHours: 0, practiceGroups: [],
            labHours: 0, labGroups: [],
            seminarHours: 0, seminarGroups: [],
        });
        setEditingBatchRow(null);
        setOpenBatch(true);
    };

    const handleAddFromGroup = (row) => {
        const items = row.items || [];
        const sampleWorkload = items[0] || workloadsData?.items?.find(w => w.subject?.id === row.subject_id);
        const lectures = items.filter(i => i.load_type === 'lecture');
        const practices = items.filter(i => i.load_type === 'practice');
        const labs = items.filter(i => i.load_type === 'lab');
        const seminars = items.filter(i => i.load_type === 'seminar');

        setEditingBatchRow(row);
        setBatchData({
            edu_plan_id: sampleWorkload?.edu_plan_id || '',
            department_id: sampleWorkload?.subject?.department_id || '',
            subject_id: row.subject_id,
            semester: 'kuzgi',
            name: row.name || '',
            hasLecture: lectures.length > 0,
            lectureHours: lectures[0]?.hours || 0,
            lectureStreams: lectures.map(i => i.stream_id).filter(Boolean),
            hasPractice: practices.length > 0,
            practiceHours: practices[0]?.hours || 0,
            practiceGroups: practices.map(i => i.group_id).filter(Boolean),
            hasLab: labs.length > 0,
            labHours: labs[0]?.hours || 0,
            labGroups: labs.map(i => i.group_id).filter(Boolean),
            hasSeminar: seminars.length > 0,
            seminarHours: seminars[0]?.hours || 0,
            seminarGroups: seminars.map(i => i.group_id).filter(Boolean),
        });
        setOpenBatch(true);
    };

    const handleBatchSubmit = async () => {
        const items = [];
        const getNewIds = (selectedIds, type, idField = 'group_id') => {
            if (!editingBatchRow) return selectedIds;
            const existingIds = editingBatchRow.items.filter(i => i.load_type === type).map(i => i[idField]);
            return selectedIds.filter(id => !existingIds.includes(id));
        };

        if (batchData.hasLecture && batchData.lectureHours > 0 && batchData.lectureStreams.length > 0) {
            const newStreams = getNewIds(batchData.lectureStreams, 'lecture', 'stream_id');
            if (newStreams.length > 0) items.push({ load_type: 'lecture', hours: parseInt(batchData.lectureHours), stream_ids: newStreams, group_ids: [] });
        }
        if (batchData.hasPractice && batchData.practiceHours > 0 && batchData.practiceGroups.length > 0) {
            const newGroups = getNewIds(batchData.practiceGroups, 'practice', 'group_id');
            if (newGroups.length > 0) items.push({ load_type: 'practice', hours: parseInt(batchData.practiceHours), stream_ids: [], group_ids: newGroups });
        }
        if (batchData.hasLab && batchData.labHours > 0 && batchData.labGroups.length > 0) {
            const newGroups = getNewIds(batchData.labGroups, 'lab', 'group_id');
            if (newGroups.length > 0) items.push({ load_type: 'lab', hours: parseInt(batchData.labHours), stream_ids: [], group_ids: newGroups });
        }
        if (batchData.hasSeminar && batchData.seminarHours > 0 && batchData.seminarGroups.length > 0) {
            const newGroups = getNewIds(batchData.seminarGroups, 'seminar', 'group_id');
            if (newGroups.length > 0) items.push({ load_type: 'seminar', hours: parseInt(batchData.seminarHours), stream_ids: [], group_ids: newGroups });
        }

        if (items.length === 0) {
            if (editingBatchRow) return alert("Yangi yuklama qo'shilmadi (barchasi allaqachon mavjud).");
            return alert("Kamida bitta yuklama turini tanlang.");
        }

        await createBatchMutation.mutateAsync({
            subject_id: batchData.subject_id,
            edu_plan_id: batchData.edu_plan_id || null,
            name: batchData.name || null,
            items: items
        });
        setOpenBatch(false);
    };

    const handleOpenEdit = (item) => {
        setEditItem(item);
        setEditData({
            subject_id: item.subject_id,
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

    const handleOpenGroupEdit = (row) => {
        setGroupEditItem(row);
        const sampleWorkload = workloadsData?.items?.find(w => w.subject?.id === row.subject_id);
        setGroupEditData({
            new_subject_id: row.subject_id,
            new_name: row.name || '',
            department_id: sampleWorkload?.subject?.department_id || '',
            new_edu_plan_id: sampleWorkload?.edu_plan_id || ''
        });
        setOpenGroupEdit(true);
    };

    const handleGroupEditSubmit = async () => {
        const payload = {
            subject_id: groupEditItem.subject_id,
            new_subject_id: groupEditData.new_subject_id,
            new_name: groupEditData.new_name,
            new_edu_plan_id: groupEditData.new_edu_plan_id
        };
        await updateGroupMutation.mutateAsync(payload);
        setOpenGroupEdit(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('O\'chirishni tasdiqlaysizmi?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleGroupDelete = async (row) => {
        if (window.confirm(`"${row.subject_name}" dagi BARCHA yuklamalarni o'chirishni tasdiqlaysizmi?`)) {
            await deleteGroupMutation.mutateAsync(row.subject_id);
        }
    };

    return (
        <div className="p-6">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
                    Yuklamalar (Workloads)
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenBatch} className="bg-emerald-600 hover:bg-emerald-700">
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
                            <TableCell align="center">Ma'ruza</TableCell>
                            <TableCell align="center">Amaliyot</TableCell>
                            <TableCell align="center">Lab</TableCell>
                            <TableCell>Targetlar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                            </TableRow>
                        ) : groupedWorkloads.map((row) => (
                            <WorkloadRow
                                key={row.subject_id}
                                row={row}
                                onDelete={handleDelete}
                                onEdit={handleOpenEdit}
                                onGroupEdit={handleOpenGroupEdit}
                                onGroupDelete={handleGroupDelete}
                                onAdd={handleAddFromGroup}
                            />
                        ))}
                    </TableBody>
                </Table>
                <Box className="p-4 flex items-center justify-between border-t border-slate-200">
                    <Pagination count={Math.ceil(total / size) || 1} page={page} onChange={(e, p) => setPage(p)} shape="rounded" className="ml-auto" />
                </Box>
            </TableContainer>

            {/* Dialogs */}
            <BatchCreateDialog
                open={openBatch}
                onClose={() => setOpenBatch(false)}
                batchData={batchData}
                setBatchData={setBatchData}
                onSubmit={handleBatchSubmit}
                eduPlans={eduPlans}
                departments={departments}
                subjects={subjects}
                streams={streams}
                groups={groups}
            />

            <EditWorkloadDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                editData={editData}
                setEditData={setEditData}
                onSubmit={handleEditSubmit}
                subjects={subjects}
                streams={streams}
                groups={groups}
            />

            <GroupEditDialog
                open={openGroupEdit}
                onClose={() => setOpenGroupEdit(false)}
                groupEditData={groupEditData}
                setGroupEditData={setGroupEditData}
                onSubmit={handleGroupEditSubmit}
                workloadsCount={workloadsData?.items?.filter(w => w.subject?.id === groupEditItem?.subject_id).length || 0}
                eduPlans={eduPlans}
                departments={departments}
                subjects={subjects}
            />
        </div>
    );
};

export default Workloads;
