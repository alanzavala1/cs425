import React from 'react';
import { Box, Typography } from '@mui/material';

const CrudOperationsBanner = () => (
  <Box sx={{ backgroundColor: 'blue.main', padding: 2, borderRadius: 4, marginBottom: 6 }}>
    <Typography variant="h4" color="common.white">CRUD Operations</Typography>
  </Box>
);

export default CrudOperationsBanner;