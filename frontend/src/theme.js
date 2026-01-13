import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode
                primary: { main: '#10b981' }, // Emerald-500
                background: { default: '#f1f5f9', paper: '#ffffff' },
                text: { primary: '#1e293b', secondary: '#64748b' },
            }
            : {
                // Dark Mode
                primary: { main: '#34d399' }, // Emerald-400
                background: { default: '#0f172a', paper: '#1e293b' }, // Slate-900 / Slate-800
                text: { primary: '#f8fafc', secondary: '#94a3b8' },
            }),
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Disable elevation overlay in dark mode
                },
            },
        },
    },
});

export default getTheme;
