import React from 'react';
import { CardContent, Container, Grid2, Box } from '@mui/material';
import axios from 'axios';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { Post } from '@/interfieses/post';
import CardComponent from './_component/CardCombonnt/CartCmponent';
import Profile from './(auth)/Profile/page';
import Caretpost from './_component/Caretpost/Caretpost';
import { redirect } from 'next/navigation'; // ✅ استيراد redirect

export default async function page() {
    const CookesDatat = await cookies();
    const tokenData = CookesDatat.get('token');

    // ✅ لو مفيش توكن → نروح للوجن
    if (!tokenData?.value) {
        redirect('/login');
    }

    let UserData: { user: string } = { user: '' };
    try {
        UserData = jwtDecode(tokenData.value);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        redirect('/login'); // ✅ لو فيه مشكلة في التوكن
    }

async function getAllpost() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}users/${UserData.user}/posts`,
      {
        headers: {
          token: tokenData?.value,
        },
      }
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

let PostListt: Post[] = await getAllpost();

PostListt = [...PostListt].sort((a, b) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});

    return (
        <Box
            sx={{
                backgroundColor: '#0f0f0f',
                background: 'linear-gradient(180deg, #0f0f0f 0%, #1A1A1A 100%)',
                minHeight: '100vh',
                padding: '16px',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '700px',
                        margin: '0 auto',
                        gap: 2,
                    }}
                >
                    {/* Create Post Component */}
                    <Box sx={{ width: '100%' }}>
                        <Caretpost />
                    </Box>

                    {/* Profile Component */}
                    <Box sx={{ width: '100%' }}>
                        <Profile />
                    </Box>

                    {/* Posts List */}
                    <Box sx={{ width: '100%' }}>
                        {PostListt.length > 0 ? (
                            PostListt.map((post) => (
                                <Box key={post.id} sx={{ mb: 2 }}>
                                    <CardComponent postDetails={post} singel={true} />
                                </Box>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    backgroundColor: '#1A1A1A',
                                    border: '1px solid #4e5a58',
                                    borderRadius: 3,
                                    mt: 2,
                                }}
                            >
                                <Box sx={{ fontSize: '48px', mb: 2 }}>
                                    📝
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '20px',
                                        color: '#ffffff',
                                        mb: 1,
                                        fontWeight: 600,
                                    }}
                                >
                                    No posts yet
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '16px',
                                        color: '#888',
                                    }}
                                >
                                    Start sharing your thoughts with the world!
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}