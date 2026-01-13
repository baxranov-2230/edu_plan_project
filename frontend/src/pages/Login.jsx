import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Fade
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const success = await login(values.username, values.password);
        if (success) {
          toast.success('Welcome back!');
          navigate('/dashboard');
        } else {
          // Error is handled in store and displayed via another mechanism, or we can toast here if store exposes error
          const errorMsg = useAuthStore.getState().error;
          toast.error(errorMsg || 'Login failed');
        }
      } catch (error) {
        toast.error(`Login failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <Box className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-700" />
      </Box>

      <Fade in={true} timeout={800}>
        <Paper
          elevation={24}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
        >
          <Box className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 transform rotate-3 hover:rotate-6 transition-transform">
              <LockIcon sx={{ fontSize: 32, color: 'white' }} />
            </div>
            <Typography variant="h4" className="font-bold text-white tracking-tight">
              EduPanel
            </Typography>
            <Typography variant="body2" className="text-gray-400 mt-2">
              Sign in to manage your education platform
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box className="flex flex-col gap-5">
              <TextField
                fullWidth
                id="username"
                name="username"
                placeholder="JSHSHIR / Email"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FingerprintIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  className: "bg-gray-900/50 text-white rounded-xl hover:bg-gray-900/70 transition-colors",
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                    color: 'white',
                  }
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="text-gray-400 hover:text-white"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  className: "bg-gray-900/50 text-white rounded-xl hover:bg-gray-900/70 transition-colors",
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                    color: 'white',
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                className="h-12 rounded-xl text-lg font-bold capitalize mt-2 shadow-lg shadow-emerald-500/25"
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  '&:hover': { bgcolor: '#059669' },
                  '&.Mui-disabled': { bgcolor: 'rgba(16, 185, 129, 0.5)', color: 'rgba(255,255,255,0.5)' }
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box className="mt-8 text-center border-t border-white/10 pt-6">
            <Typography variant="caption" className="text-gray-500">
              © 2026 EduPanel System. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
