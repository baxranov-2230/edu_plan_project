import React, { useState } from 'react';
import {
    TableCell, TableRow, Box, Typography, Chip, IconButton, Tooltip,
    Collapse, Table, TableHead, TableBody
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

/**
 * WorkloadRow - Yuklama qatori komponenti.
 * Kengaytirilgan jadval qatorini ko'rsatadi.
 */
const WorkloadRow = ({ row, onDelete, onEdit, onGroupEdit, onGroupDelete, onAdd }) => {
    const [open, setOpen] = useState(false);

    // Soatlarni hisoblash
    const lectureHours = row.items.filter(i => i.load_type === 'lecture').reduce((sum, i) => sum + i.hours, 0);
    const practiceHours = row.items.filter(i => i.load_type === 'practice').reduce((sum, i) => sum + i.hours, 0);
    const labHours = row.items.filter(i => i.load_type === 'lab').reduce((sum, i) => sum + i.hours, 0);
    const totalHours = lectureHours + practiceHours + labHours;

    // Unikal targetlarni ko'rsatish
    const renderTargets = () => {
        const targets = [];
        row.items.forEach(item => {
            if (item.stream) targets.push({ type: 'stream', id: item.stream.id, name: item.stream.name });
            if (item.group) targets.push({ type: 'group', id: item.group.id, name: item.group.name });
        });

        const unique = [];
        const seen = new Set();
        targets.forEach(t => {
            const key = `${t.type}-${t.id}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(t);
            }
        });

        return (
            <Box className="flex flex-wrap gap-1">
                {unique.slice(0, 3).map((t, idx) => (
                    <Chip
                        key={`${t.type}-${t.id}-${idx}`}
                        label={`${t.type === 'stream' ? 'Potok' : 'Guruh'}: ${t.name}`}
                        size="small"
                        variant="outlined"
                        color={t.type === 'stream' ? 'primary' : 'secondary'}
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
                            <Typography fontWeight="bold" className="text-slate-700 dark:text-slate-200">{row.subject_name}</Typography>
                            {row.name && <Typography variant="caption" className="text-slate-500 dark:text-slate-400 font-medium">{row.name}</Typography>}
                        </Box>
                        <Tooltip title="Guruhni Tahrirlash">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onGroupEdit(row); }} className="text-slate-400 hover:text-blue-600">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Yangi yuklama qo'shish">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onAdd(row); }} className="text-slate-400 hover:text-green-600">
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Guruhni O'chirish">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onGroupDelete(row); }} className="text-slate-400 hover:text-red-600">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Chip label={`${totalHours} soat`} color="default" size="small" className="bg-slate-200 text-slate-700 font-bold" />
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {lectureHours > 0 ? <Chip label={`${lectureHours} soat`} color="primary" size="small" /> : '-'}
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {practiceHours > 0 ? <Chip label={`${practiceHours} soat`} color="secondary" size="small" /> : '-'}
                </TableCell>
                <TableCell align="center" onClick={() => setOpen(!open)}>
                    {labHours > 0 ? <Chip label={`${labHours} soat`} color="success" size="small" /> : '-'}
                </TableCell>
                <TableCell onClick={() => setOpen(!open)}>
                    {renderTargets()}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, marginLeft: 6 }}>
                            <Table size="small">
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
                                            <TableCell className="text-slate-500">{item.id}</TableCell>
                                            <TableCell className="uppercase text-xs font-bold">{item.load_type}</TableCell>
                                            <TableCell>
                                                {item.stream ? <Chip label={`Potok: ${item.stream.name}`} size="small" variant='outlined' color='primary' /> :
                                                    item.group ? <Chip label={`Guruh: ${item.group.name}`} size="small" variant='outlined' color='secondary' /> : '-'}
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

export default WorkloadRow;
