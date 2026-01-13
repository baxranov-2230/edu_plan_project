import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Pagination,
    Menu,
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const mockData = [
    { id: 1, name: "Kompyuter Injiniringi 2023", code: "KI-23", faculty: "Axborot Texnologiyalari", year: "2023-2024", credits: 240, status: "Tasdiqlangan" },
    { id: 2, name: "Dasturiy Injiniring 2024", code: "DI-24", faculty: "Axborot Texnologiyalari", year: "2024-2025", credits: 240, status: "Ko'rib chiqilmoqda" },
    { id: 3, name: "Sun'iy Intellekt", code: "SI-23", faculty: "Axborot Texnologiyalari", year: "2023-2024", credits: 240, status: "Qoralama" },
    { id: 4, name: "Telekommunikatsiya", code: "TK-23", faculty: "Telekommunikatsiya", year: "2023-2024", credits: 240, status: "Tasdiqlangan" },
    { id: 5, name: "Axborot Xavfsizligi", code: "AX-24", faculty: "Kiberxavfsizlik", year: "2024-2025", credits: 240, status: "Tasdiqlangan" },
    { id: 6, name: "Iqtisodiyot", code: "IQ-23", faculty: "Iqtisodiyot", year: "2023-2024", credits: 180, status: "Ko'rib chiqilmoqda" },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'Tasdiqlangan': return 'success';
        case 'Ko\'rib chiqilmoqda': return 'warning';
        case 'Qoralama': return 'default';
        default: return 'default';
    }
};

const Curriculums = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Hammasi');

    return (
        <Box className="animate-fade-in">
            {/* Header */}
            <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <Box>
                    <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-100">
                        O'quv rejalar
                    </Typography>
                    <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mt-1">
                        Barcha o'quv rejalarni ko'rish va boshqarish
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 capitalize px-6 py-2"
                >
                    Yangi o'quv reja
                </Button>
            </Box>

            {/* Filters */}
            <Paper elevation={0} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-6 flex flex-wrap items-center gap-4">
                <TextField
                    placeholder="Qidirish..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className="text-slate-400" />
                            </InputAdornment>
                        ),
                        className: "bg-slate-50 dark:bg-slate-700 rounded-lg text-sm font-medium w-full md:w-64 text-slate-800 dark:text-slate-200"
                    }}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root': { paddingLeft: 1 }
                    }}
                />

                <Box className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['Hammasi', 'Tasdiqlangan', 'Ko\'rib chiqilmoqda', 'Qoralama'].map((status) => (
                        <Chip
                            key={status}
                            label={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-lg cursor-pointer transition-all font-medium border
                        ${statusFilter === status
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md dark:bg-emerald-600 dark:border-emerald-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <Table>
                    <TableHead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                        <TableRow>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400">Nomi</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400">Kod</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400">Fakultet</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400">O'quv yili</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400">Kreditlar</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-center">Holat</TableCell>
                            <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-center">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockData.map((row) => (
                            <TableRow key={row.id} hover className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                <TableCell>
                                    <Typography className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{row.name}</Typography>
                                </TableCell>
                                <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-xs">{row.code}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300 text-sm">{row.faculty}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300 text-sm">{row.year}</TableCell>
                                <TableCell className="text-slate-900 dark:text-emerald-400 font-bold text-sm">{row.credits}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        color={getStatusColor(row.status)}
                                        variant={row.status === 'Tasdiqlangan' ? 'filled' : 'outlined'}
                                        className="font-medium text-xs rounded-lg px-2"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Box className="flex justify-center gap-1">
                                        <IconButton size="small" className="text-slate-400 hover:text-blue-500"><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" className="text-slate-400 hover:text-emerald-500"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" className="text-slate-400 hover:text-red-500"><DeleteIcon fontSize="small" /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <Box className="p-4 flex justify-center border-t border-slate-200 dark:border-slate-700">
                    <Pagination count={10} color="primary" shape="rounded" />
                </Box>
            </TableContainer>
        </Box>
    );
};

export default Curriculums;
