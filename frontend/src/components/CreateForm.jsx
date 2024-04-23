import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CreateForm({ selectedTable, columns, handleCreate }) {
    // State variables to hold form input values
    const [formData, setFormData] = useState({});

    // Function to handle input changes and update formData state
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        handleCreate(formData); // Call the handleCreate function with form data
    };

    return (
        <div>
            <h2>Create New {selectedTable}</h2>
            <form onSubmit={handleSubmit}>
                {/* Render form inputs based on columns */}
                {columns.map((column) => (
                    <div key={column}>
                        <label htmlFor={column}>{column}</label>
                        <input
                            type="text"
                            id={column}
                            name={column}
                            value={formData[column] || ''}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

CreateForm.propTypes = {
    selectedTable: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleCreate: PropTypes.func.isRequired
};

export default CreateForm;
