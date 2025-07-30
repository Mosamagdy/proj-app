'use client';
import { store } from '@/lib/store';
import { 
  Button, 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Container,
  IconButton,
  Chip,
  Skeleton,
  LinearProgress
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { getUserData } from '@/lib/AuthSlice';
import toast, { Toaster } from 'react-hot-toast';
import CardComponent from '@/app/_component/CardCombonnt/CartCmponent';

const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  border: '0',
  padding: '0',
  clip: 'rect(0 0 0 0)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const ProfileContainer = styled(Box)({
  minHeight: '100vh',
  // background: 'linear-gradient(180deg, #0f0f0f 0%, #1A1A1A 100%)',
  color: '#ffffff',
  fontFamily: "'Inter', sans-serif",
});

const ProfileHeader = styled(Paper)({
  background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
  border: '1px solid #4e5a58',
  borderRadius: 24,
  padding: '40px 32px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(135deg, #FFFD02 0%, #f0ed00 100%)',
    opacity: 0.1,
  },
});

const ProfileAvatar = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  '&:hover .camera-overlay': {
    opacity: 1,
  },
});

const CameraOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  zIndex: 2,
});

const ActionButton = styled(Button)(({ variant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  minHeight: 48,
  padding: '12px 24px',
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #FFFD02 0%, #f0ed00 100%)',
    color: '#000000',
    border: 'none',
    boxShadow: '0 4px 16px rgba(255, 253, 2, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #f0ed00 0%, #e6e000 100%)',
      boxShadow: '0 8px 24px rgba(255, 253, 2, 0.4)',
      transform: 'translateY(-2px)',
    },
  }),
  ...(variant === 'outlined' && {
    border: '2px solid #4e5a58',
    color: '#ffffff',
    backgroundColor: 'transparent',
    '&:hover': {
      borderColor: '#FFFD02',
      backgroundColor: 'rgba(255, 253, 2, 0.05)',
      color: '#FFFD02',
    },
  }),
}));

const InfoCard = styled(Paper)({
  background: '#1A1A1A',
  border: '1px solid #4e5a58',
  borderRadius: 16,
  padding: '24px',
  marginTop: '24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#FFFD02',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
});

const StatCard = styled(Box)({
  background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
  border: '1px solid #4e5a58',
  borderRadius: 12,
  padding: '20px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#FFFD02',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
});

export default function Profile() {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const userData = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth.userData
  );
  const dispatch = useDispatch<typeof store.dispatch>();

  async function handleUploadImg(file: File | null | undefined) {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      toast.error("Configuration error");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}users/upload-photo`,
        formData,
        { headers: { token } }
      );

      toast.success('Profile photo updated successfully!');
      dispatch(getUserData());
      setImagePreview(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error('Failed to upload photo. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <ProfileContainer>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <ProfileHeader elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 4,
              textAlign: { xs: 'center', md: 'left' }
            }}>
              {/* Profile Avatar */}
              <ProfileAvatar>
                <Avatar
                  src={imagePreview || userData?.photo}
                  sx={{
                    width: 140,
                    height: 140,
                    border: '4px solid #FFFD02',
                    boxShadow: '0 8px 32px rgba(255, 253, 2, 0.3)',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60, color: '#4e5a58' }} />
                </Avatar>
                
                <CameraOverlay 
                  className="camera-overlay"
                  component="label"
                >
                  <CameraAltIcon sx={{ color: '#FFFD02', fontSize: 32 }} />
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleUploadImg(event.target?.files?.[0])}
                  />
                </CameraOverlay>

                {uploading && (
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%'
                  }}>
                    <LinearProgress 
                      sx={{ 
                        borderRadius: 2,
                        height: 4,
                        backgroundColor: '#4e5a58',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#FFFD02',
                        },
                      }} 
                    />
                  </Box>
                )}
              </ProfileAvatar>

              {/* Profile Info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#ffffff',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {userData?.name || <Skeleton width={200} sx={{ bgcolor: '#4e5a58' }} />}
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#888',
                    mb: 2,
                    fontSize: '1.1rem',
                  }}
                >
                  @{userData?.username || userData?.name?.toLowerCase().replace(' ', '_')}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  <Chip
                    icon={<PersonIcon />}
                    label="Profile"
                    sx={{
                      backgroundColor: 'rgba(255, 253, 2, 0.1)',
                      color: '#FFFD02',
                      border: '1px solid rgba(255, 253, 2, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<EmailIcon />}
                    label={userData?.email || 'Email not available'}
                    sx={{
                      backgroundColor: 'rgba(78, 90, 88, 0.1)',
                      color: '#4e5a58',
                      border: '1px solid rgba(78, 90, 88, 0.3)',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <ActionButton
                    variant="contained"
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </ActionButton>
                  
                  <ActionButton
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleUploadImg(event.target?.files?.[0])}
                    />
                  </ActionButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </ProfileHeader>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mt: 4 
        }}>
          <StatCard>
            <Typography variant="h4" sx={{ color: '#FFFD02', fontWeight: 700, mb: 1 }}>
              25
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
              Posts
            </Typography>
          </StatCard>
          
          <StatCard>
            <Typography variant="h4" sx={{ color: '#FFFD02', fontWeight: 700, mb: 1 }}>
              150
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
              Following
            </Typography>
          </StatCard>
          
          <StatCard>
            <Typography variant="h4" sx={{ color: '#FFFD02', fontWeight: 700, mb: 1 }}>
              300
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
              Followers
            </Typography>
          </StatCard>
          
          <StatCard>
            <Typography variant="h4" sx={{ color: '#FFFD02', fontWeight: 700, mb: 1 }}>
              1.2K
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
              Likes
            </Typography>
          </StatCard>
        </Box>

        {/* Additional Info */}
        <InfoCard elevation={0}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#ffffff',
              mb: 3,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            About
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ color: '#4e5a58' }} />
              <Typography sx={{ color: '#ffffff' }}>
                Member since {new Date().getFullYear()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon sx={{ color: '#4e5a58' }} />
              <Typography sx={{ color: '#ffffff' }}>
                {userData?.email || 'Email not available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarTodayIcon sx={{ color: '#4e5a58' }} />
              <Typography sx={{ color: '#ffffff' }}>
                Last active today
              </Typography>
            </Box>
          </Box>
        </InfoCard>

        {/* Posts Section */}
        <InfoCard elevation={0}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#ffffff',
              mb: 3,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Recent Posts
          </Typography>
          
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#888', mb: 2 }}>
              No posts yet
            </Typography>
            <Typography sx={{ color: '#4e5a58', fontSize: '0.9rem' }}>
              Start sharing your thoughts with the world!
            </Typography>
          </Box>
        </InfoCard>
      </Container>
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#ffffff',
            border: '1px solid #4e5a58',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#000000',
            },
          },
        }}
      />
    </ProfileContainer>
  );
}