import React from 'react';
import { Button, Typography } from '@mui/material';

const AdvancedButton = ({ onClick }) => (
  <Button onClick={onClick} sx={{ backgroundColor: 'red.main', padding: 2, borderRadius: 4, marginTop: 10, width: 'fit-content' }}>
    <Typography variant="h4" color="common.white">Advanced</Typography>
  </Button>
);

export default AdvancedButton;
