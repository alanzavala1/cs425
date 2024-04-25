import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles'; 

const Dropdown = ({ selectedTable, handleTableChange }) => {
  const theme = useTheme(); // access theme

  return (
    <Box sx={{ marginBottom: 6}}>
      <Select 
        value={selectedTable} 
        onChange={handleTableChange} 
        displayEmpty 
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{ 
          backgroundColor: theme.palette.green.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: theme.palette.green.dark, // darker background color on hover
          },
          '& .MuiSelect-icon': {
            color: '#ffffff', // set arrow icon color to white
          },
        }} 
      >
        <MenuItem value=""><em>Select Table</em></MenuItem>
        <MenuItem value="User">user</MenuItem>
        <MenuItem value="Product">product</MenuItem>
        <MenuItem value="Transaction">transaction</MenuItem>
        <MenuItem value="Bid">bid</MenuItem>
        <MenuItem value="Category">category</MenuItem>
        <MenuItem value="Review">review</MenuItem>
      </Select>
    </Box>
  );
};

export default Dropdown;
