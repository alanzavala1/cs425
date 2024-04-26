import React from 'react';
import Button from '@mui/material/Button';

function AdvancedButton({ onClick }) {
  return (
    <Button
      variant="contained" 
      color="primary" 
      onClick={onClick}
      sx={{ mt: 2 }} // Add some margin top for spacing
    >
      Go to Advanced Page
    </Button>
  );
}

export default AdvancedButton;
