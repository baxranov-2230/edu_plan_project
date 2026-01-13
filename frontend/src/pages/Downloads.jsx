import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import deleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderZipIcon from '@mui/icons-material/FolderZip';

const stats = [
    { title: "Jami fayllar", value: "1,248", icon: <InsertDriveFileIcon className="text-blue-500" />, bg: "bg-blue-50" },
    { title: "Umumiy hajm", value: "45.2 GB", icon: <CloudDownloadIcon className="text-emerald-500" />, bg: "bg-emerald-50" },
    { title: "Jami yuklamalar", value: "85.4k", icon: <FolderZipIcon className="text-orange-500" />, bg: "bg-orange-50" },
];

const files = [
    { id: 1, name: "O'quv reja 2024.pdf", category: "O'quv rejalar", size: "2.4 MB", downloads: 124, date: "12 Yan, 2024", type: "pdf" },
    { id: 2, name: "Talabalar ro'yxati.xlsx", category: "Hisobotlar", size: "1.1 MB", downloads: 85, date: "10 Yan, 2024", type: "xls" },
    { id: 3, name: "Dasturlash asoslari.docx", category: "Fan dasturlari", size: "850 KB", downloads: 256, date: "08 Yan, 2024", type: "doc" },
    { id: 4, name: "Buyruqlar to'plami.pdf", category: "Buyruqlar", size: "3.2 MB", downloads: 42, date: "05 Yan, 2024", type: "pdf" },
    { id: 5, name: "Arxiv_2023.zip", category: "Arxiv", size: "156 MB", downloads: 12, date: "01 Yan, 2024", type: "zip" },
];

const getFileIcon = (type) => {
    switch (type) {
        case 'pdf': return <PictureAsPdfIcon className="text-red-500" />;
        case 'xls': return <DescriptionIcon className="text-green-600" />;
        case 'doc': return <TextSnippetIcon className="text-blue-600" />;
        case 'zip': return <FolderZipIcon className="text-orange-500" />;
        default: return <InsertDriveFileIcon className="text-gray-500" />;
    }
};

const Downloads = () => {
    return (
        <Box className="animate-fade-in">
            {/* Header */}
            <Box className="mb-6">
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-100">
                    Yuklamalar
                </Typography>
                <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mt-1">
                    Barcha yuklangan fayllar va hujjatlar
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} className="mb-8">
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper elevation={0} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-4">
                            <Box className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} dark:bg-opacity-20`}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">{stat.value}</Typography>
                                <Typography variant="caption" className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{stat.title}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Filters and List */}
            <Paper elevation={0} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">

                {/* Toolbar */}
                <Box className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <TextField
                        placeholder="Fayl nomini qidirish..."
                        size="small"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon className="text-slate-400" /></InputAdornment>),
                            className: "bg-slate-50 dark:bg-slate-700 rounded-lg text-sm font-medium w-full sm:w-80 text-slate-800 dark:text-slate-200"
                        }}
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    />

                    <Box className="flex items-center gap-2">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                displayEmpty
                                defaultValue=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-200 font-medium"
                                sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                            >
                                <MenuItem value="">Barcha kategoriyalar</MenuItem>
                                <MenuItem value="plans">O'quv rejalar</MenuItem>
                                <MenuItem value="reports">Hisobotlar</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead className="bg-slate-50 dark:bg-slate-700/50">
                            <TableRow>
                                <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Fayl nomi</TableCell>
                                <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Kategoriya</TableCell>
                                <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Hajmi</TableCell>
                                <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Yuklamalar</TableCell>
                                <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Sana</TableCell>
                                <TableCell align="right" className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Amallar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id} hover className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <TableCell>
                                        <Box className="flex items-center gap-3">
                                            <Box className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                                                {getFileIcon(file.type)}
                                            </Box>
                                            <Typography className="text-sm font-semibold text-slate-800 dark:text-slate-200">{file.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                                            {file.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm">{file.size}</TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm">{file.downloads}</TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm">{file.date}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                            <CloudDownloadIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" className="text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Downloads;
