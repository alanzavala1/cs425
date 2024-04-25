import React from 'react';
import { Button, Box } from '@mui/material';

const OperationButtons = ({ handleCreate, handleRead, handleUpdate, handleDelete }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Button onClick={handleCreate} color="primary" variant="contained">Create</Button>
      <Button onClick={handleRead} color="primary" variant="contained">Read</Button>
      <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
      <Button onClick={handleDelete} color="primary" variant="contained">Delete</Button> {/* Added this line */}
    </Box>
  );
};

export default OperationButtons;
