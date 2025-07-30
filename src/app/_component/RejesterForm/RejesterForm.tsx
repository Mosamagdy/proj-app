// "use client";

// import { VisibilityOff, Visibility } from '@mui/icons-material';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
//   Paper,
//   Radio,
//   RadioGroup,
//   TextField,
//   Typography,
//   Link,
//   Stack
// } from '@mui/material';
// import React from 'react';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import LoginImage from '../../../../public/public/imgs/login2.jpg';

// export default function Register() {
//   const router = useRouter();

//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showRePassword, setShowRePassword] = React.useState(false);

//   const togglePasswordVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter(prev => !prev);
//   const suppressMouse = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

//   interface InitialVal {
//     name: string;
//     email: string;
//     password: string;
//     rePassword: string;
//     dateOfBirth: string;
//     gender: string;
//   }

//   const initialValues: InitialVal = {
//     name: "",
//     email: "",
//     password: "",
//     rePassword: "",
//     dateOfBirth: "",
//     gender: ""
//   };

//   const formik = useFormik({
//     initialValues,
//     onSubmit: handleRegister
//   });

//   function handleRegister(data: InitialVal) {
//     axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}users/signup`, data)
//       .then((res) => {
//         toast.success(res.data.message);
//         router.push('/login');
//       })
//       .catch((err) => {
//         toast.error(err.response?.data?.error || "Registration failed");
//       });
//   }

//   return (
//     <Box
//       sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}
//     >
//       {/* Left Image Section */}
//       <Box sx={{ position: 'relative', flex: 1, minHeight: { xs: 240, md: '100vh' } }}>
//         <Image src={LoginImage} alt="Register" fill style={{ objectFit: 'cover' }} priority />
//         <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)' }} />
//         <Stack
//           spacing={1}
//           sx={{
//             position: 'absolute',
//             inset: 0,
//             zIndex: 1,
//             color: 'common.white',
//             alignItems: 'center',
//             justifyContent: 'center',
//             textAlign: 'center',
//             px: 3
//           }}
//         >
//           <Typography variant="h3" fontWeight={700}>انضم إلينا الآن</Typography>
//           <Typography variant="subtitle1">قم بإنشاء حسابك الجديد وابدأ رحلتك معنا</Typography>
//         </Stack>
//       </Box>

//       {/* Right Form Section */}
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           px: 3,
//           py: { xs: 5, md: 0 },
//           bgcolor: 'background.paper',
//         }}
//       >
//         <Paper component="form" onSubmit={formik.handleSubmit} elevation={3} sx={{ width: '100%', maxWidth: 500, p: { xs: 3, sm: 4 } }}>
//           <Stack spacing={3}>
//             <Box>
//               <Typography variant="h5" fontWeight={600}>Create an Account</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Please fill in the form below to register.
//               </Typography>
//             </Box>

//             <TextField
//               id="name"
//               name="name"
//               label="Full Name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               fullWidth
//             />

//             <TextField
//               id="email"
//               name="email"
//               label="Email"
//               type="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               fullWidth
//             />

//             <FormControl variant="outlined" fullWidth>
//               <InputLabel htmlFor="password">Password</InputLabel>
//               <OutlinedInput
//                 id="password"
//                 name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={togglePasswordVisibility(setShowPassword)}
//                       onMouseDown={suppressMouse}
//                       onMouseUp={suppressMouse}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 label="Password"
//               />
//             </FormControl>

//             <FormControl variant="outlined" fullWidth>
//               <InputLabel htmlFor="rePassword">Confirm Password</InputLabel>
//               <OutlinedInput
//                 id="rePassword"
//                 name="rePassword"
//                 type={showRePassword ? 'text' : 'password'}
//                 value={formik.values.rePassword}
//                 onChange={formik.handleChange}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={togglePasswordVisibility(setShowRePassword)}
//                       onMouseDown={suppressMouse}
//                       onMouseUp={suppressMouse}
//                       edge="end"
//                     >
//                       {showRePassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 label="Confirm Password"
//               />
//             </FormControl>

//             <TextField
//               id="dateOfBirth"
//               name="dateOfBirth"
//               type="date"
//               label="Birth Date"
//               value={formik.values.dateOfBirth}
//               onChange={formik.handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />

//             <FormControl>
//               <FormLabel id="gender">Gender</FormLabel>
//               <RadioGroup
//                 row
//                 name="gender"
//                 value={formik.values.gender}
//                 onChange={formik.handleChange}
//               >
//                 <FormControlLabel value="female" control={<Radio />} label="Female" />
//                 <FormControlLabel value="male" control={<Radio />} label="Male" />
//               </RadioGroup>
//             </FormControl>

//             <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 9999, py: 1.25 }}>
//               Register
//             </Button>

//             <Typography textAlign="center" variant="body2">
//               Already have an account? <Link href="/login" underline="hover">Login</Link>
//             </Typography>
//           </Stack>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }
