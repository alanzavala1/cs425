import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Button, Typography} from '@mui/material';
import { theme } from '../theme/theme';
import CrudOperationsBanner from './CrudOperationsBanner';
import Dropdown from './Dropdown';
import OperationButtons from './OperationButtons';
import axios from 'axios';
import TablePage from './TablePage';
import { CreateItemForm, UpdateItemForm, DeleteItemForm } from './Forms';

function App() {
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createMode, setCreateMode] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [showTablePage, setShowTablePage] = useState(true);

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
            setShowTablePage(false)
            setColumns(tableColumnMapping[selectedTable] || []);
            resetState();
        }
    }, [selectedTable, tableColumnMapping]);

    const resetState = (resetTable = true) => {
      setError(null);
      setLoading(false);
      setIsCreating(false);
      setCreateMode(false);
      setSelectedItem(null);
      if (resetTable) {
          setShowTablePage(true);
      }
    };

    const handleTableChange = (event) => {
      setSelectedTable(event.target.value);
      setShowTablePage(false); // Hide the table when a new table is selected
      setShowAdvancedOptions(false); // Ensure advanced options are hidden
      setShowDeleteForm(false); // Hide delete form
      setShowUpdateForm(false); // Hide update form
    };

    const handleCreateClick = () => {
      setShowTablePage(false);
      setIsCreating(true);
      setCreateMode(true);
      setShowUpdateForm(false);
      setShowDeleteForm(false); // Hide delete form
  };
  
  const handleUpdateClick = (item) => {
    setShowTablePage(false);
    setSelectedItem(item);
    setIsCreating(false);
    setShowUpdateForm(true); // Show update form
    setShowDeleteForm(false); // Hide delete form
};
  
  const handleDeleteClick = () => {
      resetState(true);
      setShowDeleteForm(true);
      setShowTablePage(false);
      setShowUpdateForm(false);
      setShowAdvancedOptions(false); // Ensure advanced options are hidden
  };
  
  const handleAdvancedClick = () => {
      setShowTablePage(false);
      setShowAdvancedOptions(!showAdvancedOptions);
      setShowDeleteForm(false); // Hide delete form
      setShowUpdateForm(false);
  };

 
    const handleRead = async () => {
      resetState(true);
      setIsCreating(false);
      setShowUpdateForm(false); // Show update form
      setShowDeleteForm(false)
      setError(null);
      try {
          const response = await axios.get(`http://localhost:8000/${selectedTable.toLowerCase()}/`);
          setTableData(response.data);
      } catch (error) {
          setError('Error fetching data. Please try again.');
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  };

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
        }
    };

    const handleUpdate = async (formData) => {
        setLoading(true);
        setError(null);
        const primaryKeyField = primaryKeyMapping[selectedTable];
        const primaryKeyValue = formData[primaryKeyField];

        try {
            const response = await axios.put(`http://localhost:8000/${selectedTable.toLowerCase()}/${primaryKeyValue}`, formData);
            setTableData(tableData.map(item => item[primaryKeyField] === primaryKeyValue ? { ...item, ...response.data } : item));
        } catch (error) {
            setError('Error updating item. Please try again.');
            console.error('Error updating item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`http://localhost:8000/${selectedTable.toLowerCase()}/${itemId}`);
            const updatedTableData = tableData.filter(item => item.id !== itemId);
            setTableData(updatedTableData);
        } catch (error) {
            setError('Error deleting item. Please try again.');
            console.error('Error deleting item:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCubeData = async () => {
      setLoading(true);
      setShowDeleteForm(false);
      setShowAdvancedOptions(false);
      setError(null);

      try {
          const response = await axios.get('http://localhost:8000/sales/cube');
          setTableData(response.data);
          setColumns(['CategoryID', 'SellerID', 'SaleMonth', 'TotalSales']);
          setShowTablePage(true);
      } catch (error) {
          setError('Failed to fetch data from the cube.');
          console.error('Error fetching cube data:', error);
      } finally {
          setLoading(false);
      }
  };

  const fetchPriceData = async () => {
      setLoading(true);
      setShowDeleteForm(false);
      setShowAdvancedOptions(false);
      setError(null);

      try {
          const response = await axios.get('http://localhost:8000/compare_price');
          setTableData(response.data);
          setColumns(['ProductID', 'Title', 'Price', 'NextPri']);
          setShowTablePage(true);
      } catch (error) {
          setError('Failed to fetch price comparison data.');
          console.error('Error fetching price data:', error);
      } finally {
          setLoading(false);
      }
  };

  const fetchSegmentation = async () => {
      setLoading(true);
      setShowDeleteForm(false);
      setShowAdvancedOptions(false);
      setError(null);

      try {
          const response = await axios.get('http://localhost:8000/segmentation/');
          setTableData(response.data);
          setColumns(['Customer_Segment', 'ProductID', 'Product_Name', 'Month', 'Monthly_Sales']);
          setShowTablePage(true);
      } catch (error) {
          setError('Failed to fetch segmentation data.');
          console.error('Error fetching segmentation data:', error);
      } finally {
          setLoading(false);
      }
  };

  const advancedOptions = [
      { id: 1, label: "Sales Cube", action: fetchCubeData },
      { id: 2, label: "Compare Prices", action: fetchPriceData },
      { id: 3, label: "Customer Segmentation", action: fetchSegmentation }
  ];

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', // Use minHeight to ensure the container expands with content
            padding: 8, 
            backgroundColor: '#171717',
            overflowY: 'auto' // Enable vertical scrolling
        }}>
            <CrudOperationsBanner />
            <Dropdown selectedTable={selectedTable} handleTableChange={handleTableChange} />
            <Box sx={{ mb: 3, color: 'green.main' }}>
                <OperationButtons
                    handleCreate={handleCreateClick}
                    handleRead={handleRead}
                    handleUpdate={handleUpdateClick}
                    handleDelete={handleDeleteClick}
                    handleAdvanced={handleAdvancedClick}
                />
            </Box>
            {showAdvancedOptions && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2, marginBottom: 4 }}>
                    {advancedOptions.map(option => (
                        <Button
                            key={option.id}
                            onClick={option.action}
                            color="primary"
                            variant="contained"
                            sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                        >
                            {option.label}
                        </Button>
                    ))}
                </Box>
            )}
            {showTablePage && tableData.length > 0 && <TablePage data={tableData} columns={columns} />}
            {showDeleteForm && selectedTable && <DeleteItemForm onSubmit={handleDelete} />}
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {isCreating && createMode && <CreateItemForm columns={columns} onSubmit={handleCreate} />}
            {showUpdateForm && selectedItem && <UpdateItemForm columns={columns} selectedItem={selectedItem} onSubmit={handleUpdate} />}
        </Box>
    </ThemeProvider>
);
}

export default App;