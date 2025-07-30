"use client";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Box,
  Typography,
  Link
} from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToken } from '@/lib/AuthSlice';
import Image from 'next/image';
import LoginImage from '../../../../public/public/imgs/login2.jpg';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  interface InitialVal {
    email: string;
    password: string;
  }

  const initialValues: InitialVal = {
    email: "",
    password: "",
  };

  const LoginFormik = useFormik({
    initialValues,
    onSubmit: handleLogin,
  });

  function handleLogin(data: InitialVal) {
    axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}users/signin`, data)
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        document.cookie = `token=${res.data.token}`;
        dispatch(addToken(res.data.token));
        window.location.href = "/Post";
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Login failed");
      });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {/* الصورة */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display:{ xs: 'none', md: 'block' }, // إخفاء الصورة في الشاشات الصغيرة
          flex: 1,
          height: '100vh',
        }}
      >
        <Image
          src={LoginImage}
          alt="Login"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '0', // بدون حواف
          }}
        />
      </Box>

      {/* الفورم */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          flex: 1,
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
      >
        {/* المحتوى داخل الفورم */}
        <Box
          sx={{
            width: '80%',
            maxWidth: 400,
          }}
        >
          <Typography sx={{ color: 'var(--mini-color)', fontSize: '0.9rem', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 3 }}>
            Login to your account
          </Typography>

          <Paper component="form" onSubmit={LoginFormik.handleSubmit} sx={{ p: 3 }}>
            <TextField
              onChange={LoginFormik.handleChange}
              value={LoginFormik.values.email}
              id="email"
              name="email"
              type="email"
              label="Enter Your Email"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />

            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                onChange={LoginFormik.handleChange}
                value={LoginFormik.values.password}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                borderRadius: '1000rem',
                backgroundColor: 'var(--sec-color)',
                color: 'var(--main-color)',
                '&:hover': {
                  backgroundColor: 'var(--mini-color)',
                },
              }}
            >
              Login
            </Button>
          </Paper>

          {/* Forgot Password Link */}
          <Box sx={{ mt: 2 }}>
<Link component={NextLink} href="/ChangePassword" sx={{ fontSize: '0.9rem', color: 'var(--mini-color)', textDecoration: 'none' }}>
  Change Password
</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
