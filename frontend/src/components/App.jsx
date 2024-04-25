import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from '../theme/theme';
import CrudOperationsBanner from './CrudOperationsBanner';
import Dropdown from './Dropdown';
import OperationButtons from './OperationButtons';
import axios from 'axios';
import TablePage from './TablePage';
import { CreateItemForm, UpdateItemForm, DeleteItemForm } from './Forms';  // Import the forms

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false); // State to control DeleteItemForm visibility

  const primaryKeyMapping = useMemo(() => ({
    User: 'UserID',
    Product: 'ProductID',
    Bid: 'BidID',
    Transaction: 'TransactionID',
    Category: 'CategoryID',
    Review: 'ProductID' // Assuming the primary key here as an example
  }), []);

  const tableColumnMapping = useMemo(() => ({
    User: ['UserID', 'Username', 'Email', 'Password', 'RegistrationDate', 'LastLoginDate', 'DeliveryAddress'],
    Product: ['ProductID', 'Title', 'Description', 'Price', 'Conditionn', 'CategoryID', 'SellerID', 'ShippingAddress'],
    Bid: ['BidID', 'ProductID', 'UserID', 'BidAmount', 'BidTime'],
    Transaction: ['TransactionID','BuyerID', 'SellerID', 'ProductID', 'TransactionDate', 'Quantity','EstimatedDeliveryDate', 'Delivered', 'DeliveryAddress', 'ShippingAddress'],
    Category: ['CategoryID', 'CategoryName'],
    Review: ['ProductID', 'UserID', 'Rating', 'Comment', 'ReviewDate'],
  }), []);

  useEffect(() => {
    if (selectedTable) {
      setColumns(tableColumnMapping[selectedTable] || []);
      setIsCreating(false);  // Reset creating state whenever table changes
    }
  }, [selectedTable, tableColumnMapping]);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setTableData([]);
    setIsCreating(false);
    setCreateMode(false);
    setShowDeleteForm(false); // Hide DeleteItemForm when changing the table
  };

  const handleRead = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/${selectedTable.toLowerCase()}/`);
      setTableData(response.data);
      setIsCreating(false);  // Ensure not in creating mode after reading
      setShowDeleteForm(false); // Hide DeleteItemForm after reading
    } catch (error) {
      setError('Error fetching data. Please try again.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (item) => {
    console.log("Update button clicked!");  // This will confirm the button is being clicked.
    setSelectedItem(item);  // Set the item you want to update.
    setIsCreating(true);    // Use this state to show the form.
    setCreateMode(false);   // Assuming this indicates you're not in create mode.
    setShowDeleteForm(false); // Hide DeleteItemForm when updating
  };
  

  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsCreating(true);
    setCreateMode(true);
    setShowDeleteForm(false); // Hide DeleteItemForm when creating
  };

  const handleDeleteClick = () => {
    setShowDeleteForm(true); // Show DeleteItemForm when delete button is clicked
  };

  // Function to handle item creation
  const handleCreate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/${selectedTable.toLowerCase()}`, formData);
      setTableData([...tableData, response.data]);
    } catch (error) {
      setError('Error creating item. Please try again.');
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
      setIsCreating(false);
    }
  };

  // Function to handle item updates
  const handleUpdate = async (formData) => {
    setLoading(true);
    setError(null);

    const primaryKeyField = primaryKeyMapping[selectedTable];
    const primaryKeyValue = formData[primaryKeyField];

    try {
      const response = await axios.put(`http://localhost:8000/${selectedTable.toLowerCase()}/${primaryKeyValue}`, formData);
      setTableData(tableData.map(item => item[primaryKeyField] === primaryKeyValue ? {...item, ...response.data} : item));
    } catch (error) {
      setError('Error updating item. Please try again.');
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
      setIsCreating(false); // Close the form after update
    }
  };

  // Function to handle item deletion
  const handleDelete = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      // Make API call to delete the item
      await axios.delete(`http://localhost:8000/${selectedTable.toLowerCase()}/${itemId}`);
      // Update table data after successful deletion
      const updatedTableData = tableData.filter(item => item.id !== itemId);
      setTableData(updatedTableData);
    } catch (error) {
      setError('Error deleting item. Please try again.');
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 4, backgroundColor: '#171717' }}>
        <CrudOperationsBanner />
        <Dropdown selectedTable={selectedTable} handleTableChange={handleTableChange} />
        {/* Pass handleDelete to OperationButtons */}
        <OperationButtons
          handleCreate={handleCreateClick}
          handleRead={handleRead}
          handleUpdate={handleUpdateClick}
          handleDelete={handleDeleteClick} // Pass the handleDeleteClick function
        />
        {/* Conditionally render DeleteItemForm */}
        {showDeleteForm && selectedTable && (
          <DeleteItemForm onSubmit={handleDelete} />
        )}
        {loading && <CircularProgress />}
        {error && <p>{error}</p>}
        {!isCreating && selectedTable && tableData.length > 0 && (
          <TablePage data={tableData} columns={columns} onUpdateClick={handleUpdateClick} />
        )}
        {isCreating && createMode && (
          <CreateItemForm columns={columns} onSubmit={handleCreate} />
        )}
        {isCreating && !createMode && selectedItem && (
          <UpdateItemForm columns={columns} selectedItem={selectedItem} onSubmit={handleUpdate} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
