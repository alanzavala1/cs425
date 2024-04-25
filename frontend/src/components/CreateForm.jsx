import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material'; // import Typography

const CreateForm = ({ columns, onCreate }) => {
  const [formData, setFormData] = useState(
    columns.reduce((acc, column) => ({ ...acc, [column]: '' }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom style={{ color: '#FFF' }}>
        Enter values
      </Typography>
      {columns.map((column) => (
        <TextField
          key={column}
          name={column}
          label={column}
          value={formData[column]}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="outlined"
          InputProps={{ // add InputProps for styling the input
            style: { backgroundColor: 'white' },
          }}
        />
      ))}
      <Button type="submit" color="primary" variant="contained" style={{ marginTop: 8 }}>
        Submit
      </Button>
    </form>
  );
};

export default CreateForm;