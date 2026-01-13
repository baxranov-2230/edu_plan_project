import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Mock Data for Charts
const studentData = [
  { name: '1-Kurs', boys: 120, girls: 90 },
  { name: '2-Kurs', boys: 110, girls: 100 },
  { name: '3-Kurs', boys: 130, girls: 85 },
  { name: '4-Kurs', boys: 100, girls: 95 },
];

const downloadData = [
  { name: 'Jan', downloads: 65 },
  { name: 'Feb', downloads: 85 },
  { name: 'Mar', downloads: 120 },
  { name: 'Apr', downloads: 90 },
  { name: 'May', downloads: 140 },
  { name: 'Jun', downloads: 110 },
];

const subjectData = [
  { name: 'Matematika', value: 400 },
  { name: 'Fizika', value: 300 },
  { name: 'IT', value: 300 },
  { name: 'Tarix', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon, color, gradient, trend }) => (
  <Paper
    elevation={0}
    className="relative overflow-hidden p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
    sx={{ border: 'none' }}
  >
    <Box className="flex justify-between items-start mb-4">
      <Box
        className={`p-3 rounded-xl text-white shadow-lg ${gradient}`}
      >
        {React.cloneElement(icon, { sx: { fontSize: 28 } })}
      </Box>
      <Box className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
        <TrendingUpIcon sx={{ fontSize: 14 }} /> {trend}
      </Box>
    </Box>

    <Box>
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-slate-100 mb-1">
        {value}
      </Typography>
      <Typography variant="body2" className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs">
        {title}
      </Typography>
    </Box>

    <Box
      className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110"
      sx={{ bgcolor: color }}
    />
  </Paper>
);

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box className="animate-fade-in">
      <Box className="flex justify-between items-end mb-8">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Xush kelibsiz, Admin! 👋
          </Typography>
          <Typography variant="body1" className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {currentDate}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          className="bg-slate-900 text-white hover:bg-slate-800 capitalize rounded-xl shadow-lg shadow-slate-900/20 px-6"
        >
          Hisobotni yuklash
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Guruhlar"
            value="24"
            icon={<GroupsIcon />}
            color="#0ea5e9"
            gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="O'quv rejalar"
            value="12"
            icon={<AssignmentIcon />}
            color="#8b5cf6"
            gradient="bg-gradient-to-br from-violet-400 to-purple-500"
            trend="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fan dasturlari"
            value="48"
            icon={<ClassIcon />}
            color="#f59e0b"
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Yuklamalar"
            value="156"
            icon={<DownloadIcon />}
            color="#10b981"
            gradient="bg-gradient-to-br from-emerald-400 to-green-500"
            trend="+24%"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} className="mb-8">
        {/* Main Bar Chart */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 h-[400px] shadow-sm">
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">Talabalar taqsimoti</Typography>
              <Chip label="Joriy o'quv yili" size="small" className="bg-slate-100 text-slate-600 font-medium" />
            </Box>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="boys" name="O'g'il bolalar" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="girls" name="Qiz bolalar" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Donut Chart */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 h-[400px] shadow-sm flex flex-col">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100 mb-4">Yo'nalishlar bo'yicha</Typography>
            <Box className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section: Activity & Events */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">So'nggi faoliyatlar</Typography>
              <Button size="small" className="text-emerald-600 font-semibold">Barchasini ko'rish</Button>
            </Box>
            <List>
              {[1, 2, 3].map((item, index) => (
                <ListItem key={index} className="px-0 mb-2">
                  <ListItemAvatar>
                    <Avatar className="bg-slate-100 text-emerald-600">
                      {index === 0 ? <ArticleIcon /> : index === 1 ? <PeopleIcon /> : <ClassIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {index === 0 ? 'Yangi o\'quv reja tasdiqlandi' : index === 1 ? 'Yangi talaba qo\'shildi' : 'Fan dasturi yangilandi'}
                      </span>
                    }
                    secondary="2 soat oldin • Admin tomonidan"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                  <Chip label="Faol" size="small" color="success" variant="outlined" className="text-xs h-6" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm h-full">
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">Kelgusi tadbirlar</Typography>
              <CalendarMonthIcon className="text-slate-400" />
            </Box>
            {[1, 2].map((item) => (
              <Box key={item} className="flex gap-4 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <Box className="flex flex-col items-center justify-center w-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm h-12">
                  <Typography className="text-xs font-bold text-slate-400 uppercase">Feb</Typography>
                  <Typography className="text-lg font-bold text-emerald-600">{14 + item}</Typography>
                </Box>
                <Box>
                  <Typography className="font-bold text-slate-800 dark:text-slate-100 text-sm">Ilmiy Kengash Yig'ilishi</Typography>
                  <Typography className="text-xs text-slate-500 mt-1">14:00 - 16:00 • Anjumanlar zali</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Dashboard;
