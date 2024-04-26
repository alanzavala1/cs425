// In src/components/OperationButtons.js
import React from 'react';
import { Button, Box} from '@mui/material';

function OperationButtons({ handleCreate, handleRead, handleUpdate, handleDelete, handleAdvanced}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Button onClick={handleCreate} color="green" variant="contained">Create</Button>
      <Button onClick={handleRead} color="green" variant="contained">Read</Button>
      <Button onClick={handleUpdate} color="green" variant="contained">Update</Button>
      <Button onClick={handleDelete} color="green" variant="contained">Delete</Button>
      <Button onClick={handleAdvanced} color="red" variant="contained">Advanced</Button>
    </Box>
  );
}

export default OperationButtons;
