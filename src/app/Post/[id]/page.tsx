import { Grid, Container } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import { Post } from '@/interfieses/post';
import CardComponent from '../../_component/CardCombonnt/CartCmponent';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const tokenData = cookies().get('token');

  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${id}`, {
    headers: {
      token: tokenData?.value || '',
    },
  });

  const post: Post = response.data.post;

  return (
    <div
      style={{
        backgroundColor: 'var(--main-color)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CardComponent singel={false} postDetails={post} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
