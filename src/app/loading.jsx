import React from 'react';
import { Box } from '@mui/material';

export default function Loading() {
  return (
    <div style={{ backgroundColor: '#556B2F' }}>
    <Box sx={{
      
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <span className="loader"></span>
    </Box>
 </div>
  );
}