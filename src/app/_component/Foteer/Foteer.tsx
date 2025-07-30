import React from 'react';
import { Box } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      width: '100vw',
      backgroundColor: '#f0f0f0', 
      padding: '10px',
      textAlign: 'center',
    }}>
      <div>Foteer</div>
    </Box>
  );
}