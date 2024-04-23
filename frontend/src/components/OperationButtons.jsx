import React from 'react';
import { Box, Button } from '@mui/material';

const OperationButtons = ({ handleCreate, handleRead, handleUpdate, handleDelete }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, marginBottom: 7 }}>
    <Button onClick={handleCreate} color="green" variant="contained" size="large">Create</Button>
    <Button onClick={handleRead} color="green" variant="contained" size="large">Read</Button>
    <Button onClick={handleUpdate} color="green" variant="contained" size="large">Update</Button>
    <Button onClick={handleDelete} color="green" variant="contained" size="large">Delete</Button>
  </Box>
);

export default OperationButtons;
