//Forms.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';

export const CreateItemForm = ({ columns, onSubmit }) => {
  const [formData, setFormData] = useState(
    columns.reduce((acc, column) => ({ ...acc, [column]: '' }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom style={{ color: '#FFF' }}>
        Enter New Information
      </Typography>
      {columns.map((column) => (
        <TextField
          key={column}
          name={column}
          label={column}
          value={formData[column] || ''}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="outlined"
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />
      ))}
      <Button type="submit" color="primary" variant="contained" style={{ marginTop: 8 }}>
        Create
      </Button>
    </form>
  );
};

export const UpdateItemForm = ({ columns, onSubmit, selectedItem }) => {
  const [formData, setFormData] = useState(
    columns.reduce((acc, column) => ({
      ...acc,
      [column]: selectedItem[column]
    }), {})
  );

  useEffect(() => {
    setFormData(
      columns.reduce((acc, column) => ({
        ...acc,
        [column]: selectedItem[column]
      }), {})
    );
  }, [selectedItem, columns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom style={{ color: '#FFF' }}>
        Update Information
      </Typography>
      {columns.map((column) => (
        <TextField
          key={column}
          name={column}
          label={column}
          value={formData[column] || ''}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="outlined"
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />
      ))}
      <Button type="submit" color="primary" variant="contained" style={{ marginTop: 8 }}>
        Update
      </Button>
    </form>
  );
};

export const DeleteItemForm = ({ onSubmit }) => {
  const [itemId, setItemId] = useState('');

  const handleChange = (e) => {
    setItemId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(itemId);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom style={{ color: '#FFF' }}>
        Delete Item by ID
      </Typography>
      <TextField
        name="itemId"
        label="Item ID"
        value={itemId}
        onChange={handleChange}
        margin="normal"
        fullWidth
        variant="outlined"
        InputProps={{
          style: { backgroundColor: 'white' },
        }}
      />
      <Button type="submit" color="primary" variant="contained" style={{ marginTop: 8 }}>
        Delete
      </Button>
    </form>
  );
};