import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link as MuiLink, Box, Paper } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import GrainIcon from '@mui/icons-material/Grain';

const breadcrumbConfig = {
    '/dashboard': { label: 'Boshqaruv Paneli', icon: <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/users': { label: 'Foydalanuvchilar', icon: <PersonIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/subjects': { label: 'Fanlar', icon: <ClassIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/downloads': { label: 'Yuklamalar', icon: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/programs': { label: 'Dasturlar', icon: <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/classes': { label: 'Sinflar', icon: <ClassIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/settings': { label: 'Sozlamalar', icon: <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/faculties': { label: 'Fakultetlar', icon: <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/departments': { label: 'Kafedralar', icon: <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/roles': { label: 'Rollar', icon: <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/specialities': { label: 'Mutaxassisliklar', icon: <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/groups': { label: 'Guruhlar', icon: <GroupIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/teachers': { label: "O'qituvchilar", icon: <PersonIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/streams': { label: 'Oqimlar', icon: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/workloads': { label: 'Yuklamalar', icon: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
    '/edu-plans': { label: "O'quv Rejalar", icon: <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Paper
            elevation={0}
            className="mb-6 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50"
        >
            <MuiBreadcrumbs
                separator={<NavigateNextIcon fontSize="small" className="text-slate-400" />}
                aria-label="breadcrumb"
            >
                <MuiLink
                    component={Link}
                    to="/"
                    className="flex items-center hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors no-underline text-slate-600"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Bosh Sahifa
                </MuiLink>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const config = breadcrumbConfig[to] || { label: value, icon: null };

                    return last ? (
                        <Typography
                            key={to}
                            className="flex items-center font-semibold text-emerald-700 dark:text-emerald-400"
                        >
                            {config.icon}
                            {config.label}
                        </Typography>
                    ) : (
                        <MuiLink
                            component={Link}
                            to={to}
                            key={to}
                            className="flex items-center hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors no-underline text-slate-600"
                        >
                            {config.icon}
                            {config.label}
                        </MuiLink>
                    );
                })}
            </MuiBreadcrumbs>
        </Paper>
    );
};

export default Breadcrumbs;
