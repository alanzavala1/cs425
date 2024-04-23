import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook to access the theme

const Dropdown = ({ selectedTable, handleTableChange }) => {
  const theme = useTheme(); // Access the theme

  return (
    <Box sx={{ marginBottom: 6}}>
      <Select 
        value={selectedTable} 
        onChange={handleTableChange} 
        displayEmpty 
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{ 
          backgroundColor: theme.palette.green.main, // Set background color to green
          color: '#ffffff', // Set text color to white
          '&:hover': {
            backgroundColor: theme.palette.green.dark, // Darker background color on hover
          },
          '& .MuiSelect-icon': {
            color: '#ffffff', // Set arrow icon color to white
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
