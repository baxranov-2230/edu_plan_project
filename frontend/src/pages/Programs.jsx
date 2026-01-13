import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Chip,
    IconButton,
    Avatar,
    Tab,
    Tabs
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const programs = [
    { id: 1, title: 'Dasturlash Asoslari (C++)', category: 'Informatika', credits: 6, hours: 180, students: 245, author: 'Dr. Aliyev B.', rating: 4.8, status: 'Active', color: 'bg-blue-500' },
    { id: 2, title: 'Oliy Matematika I', category: 'Matematika', credits: 4, hours: 120, students: 310, author: 'Prof. Karimov S.', rating: 4.5, status: 'Active', color: 'bg-indigo-500' },
    { id: 3, title: 'Fizika: Mexanika', category: 'Fizika', credits: 5, hours: 150, students: 180, author: 'Dos. Umarova G.', rating: 4.2, status: 'Archived', color: 'bg-purple-500' },
    { id: 4, title: 'Web Dasturlash (Frontend)', category: 'Informatika', credits: 6, hours: 180, students: 420, author: 'Mr. Tursunov A.', rating: 4.9, status: 'Active', color: 'bg-emerald-500' },
    { id: 5, title: 'Ma\'lumotlar Bazasi', category: 'Informatika', credits: 5, hours: 150, students: 280, author: 'Dr. Valiyev F.', rating: 4.6, status: 'Active', color: 'bg-cyan-500' },
    { id: 6, title: 'Algoritmlar Nazariyasi', category: 'Informatika', credits: 4, hours: 120, students: 190, author: 'Prof. Zokirov D.', rating: 4.7, status: 'Draft', color: 'bg-orange-500' },
];

const Programs = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box className="animate-fade-in">
            {/* Header */}
            <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <Box>
                    <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-100">
                        Fan dasturlari
                    </Typography>
                    <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mt-1">
                        Kafedra fan dasturlarini boshqarish
                    </Typography>
                </Box>
                <Box className="flex gap-3">
                    <Button
                        variant="outlined"
                        className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 capitalize rounded-xl"
                        startIcon={<SearchIcon />}
                    >
                        Qidirish
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        className="bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-xl capitalize shadow-lg shadow-slate-900/20 dark:shadow-emerald-900/20"
                    >
                        Yangi dastur
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Box className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    textColor="inherit"
                    TabIndicatorProps={{ sx: { bgcolor: '#10b981', height: 3, borderRadius: '3px 3px 0 0' } }}
                >
                    <Tab label="Barchasi" className={`text-sm font-semibold capitalize ${tab === 0 ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
                    <Tab label="Informatika" className={`text-sm font-semibold capitalize ${tab === 1 ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
                    <Tab label="Matematika" className={`text-sm font-semibold capitalize ${tab === 2 ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
                    <Tab label="Fizika" className={`text-sm font-semibold capitalize ${tab === 3 ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
                </Tabs>
            </Box>

            {/* Grid */}
            <Grid container spacing={3}>
                {programs.map((prog) => (
                    <Grid item xs={12} sm={6} md={4} key={prog.id}>
                        <Paper
                            elevation={0}
                            className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Card Header with Color Banner */}
                            <Box className={`h-24 ${prog.color} p-4 flex justify-between items-start`}>
                                <Chip
                                    label={prog.status}
                                    size="small"
                                    className="bg-white/20 text-white backdrop-blur-md font-bold text-xs border-none"
                                />
                                <IconButton size="small" className="text-white hover:bg-white/20">
                                    <BookmarkBorderIcon />
                                </IconButton>
                            </Box>

                            <Box className="p-5 pt-0 relative">
                                {/* Floating Icon */}
                                <Box className="w-16 h-16 rounded-xl bg-white dark:bg-slate-700 shadow-lg absolute -top-8 left-5 flex items-center justify-center text-3xl">
                                    🎓
                                </Box>

                                <Box className="ml-24 mt-2 mb-4">
                                    <Typography variant="body2" className="text-slate-500 dark:text-slate-400 font-medium">{prog.category}</Typography>
                                    <Box className="flex items-center gap-1 text-amber-400">
                                        <StarIcon fontSize="small" />
                                        <Typography variant="body2" className="font-bold text-slate-700 dark:text-slate-200">{prog.rating}</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight line-clamp-2 min-h-[3rem]">
                                    {prog.title}
                                </Typography>

                                <Box className="flex flex-wrap gap-3 mb-6">
                                    <Box className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                        <CreditCardIcon sx={{ fontSize: 16 }} /> {prog.credits} Kredit
                                    </Box>
                                    <Box className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                        <AccessTimeIcon sx={{ fontSize: 16 }} /> {prog.hours} Soat
                                    </Box>
                                </Box>

                                <Box className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <Box className="flex items-center gap-2">
                                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#cbd5e1' }}>{prog.author[0]}</Avatar>
                                        <Typography variant="caption" className="font-semibold text-slate-600 dark:text-slate-400">{prog.author}</Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        endIcon={<VisibilityIcon />}
                                        className="text-emerald-600 hover:bg-emerald-50 rounded-lg capitalize font-bold"
                                    >
                                        Ko'rish
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Programs;
