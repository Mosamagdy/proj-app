// src/app/Post/[id]/page.tsx

import { Container } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import { Post } from '@/interfieses/post';
import CardComponent from '../../_component/CardCombonnt/CartCmponent';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
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
        <Grid2 container justifyContent="center" alignItems="center">
          <Grid2>
            <CardComponent singel={false} postDetails={post} />
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
}
