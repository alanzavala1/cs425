import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo here
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from '../theme/theme';
import CrudOperationsBanner from './CrudOperationsBanner';
import Dropdown from './Dropdown';
import OperationButtons from './OperationButtons';
import axios from 'axios';
import TablePage from './TablePage';
import CreateForm from './CreateForm';

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  //const [setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const tableColumnMapping = useMemo(() => ({
    User: ['UserID', 'Username', 'Email', 'Password', 'RegistrationDate', 'LastLoginDate', 'DeliveryAddress'],
    Product: ['ProductID', 'Title', 'Description', 'Price', 'Conditionn', 'CategoryID', 'SellerID', 'ShippingAddress'],
    Bid: ['BidID', 'ProductID', 'UserID', 'BidAmount', 'BidTime'],
    Transaction: ['TransactionID','BuyerID', 'SellerID', 'ProductID', 'TransactionDate', 'Quantity','EstimatedDeliveryDate', 'Delivered', 'DeliveryAddress', 'ShippingAddress'],
    Category: ['CategoryID', 'CategoryName'],
    Review: ['ProductID', 'UserID', 'Rating', 'Comment', 'ReviewDate'],
  }), []);

  const hideTable = () => {
    setTableData([]); // Clearing the table data will hide the table
  };

  useEffect(() => {
    if (selectedTable) {
      const newColumns = tableColumnMapping[selectedTable] || [];
      setColumns(newColumns);
      setIsCreating(false);
    }
  }, [selectedTable, tableColumnMapping]);
  

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    // Remove setShowCreateForm if not used
    // setShowCreateForm(false);
    hideTable(); // Also hide the table
  };


  const handleRead = async () => {
    if (selectedTable) {
      setLoading(true);
      setError(null);
      //setShowCreateForm(false); // This will hide the create form
  
      try {
        const response = await axios.get(`http://localhost:8000/${selectedTable.toLowerCase()}/`);
        setTableData(response.data); // This will set new data
        setIsCreating(false); // Ensure we are not in creating mode
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Pass formData directly to the POST request
      const response = await axios.post(`http://localhost:8000/${selectedTable.toLowerCase()}/`, formData);
      console.log("Data submitted successfully", response.data);
      setTableData([...tableData, response.data]);
    } catch (error) {
      console.error('Error submitting data:', error.response ? error.response.data : error.message);
      setError('Error submitting data: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
      setLoading(false);
      setIsCreating(false); // Close the form on submission
   }
  };

  const toggleCreateForm = () => {
    setIsCreating(!isCreating);
    if (isCreating) {
      hideTable(); // If currently showing the form, hide the table
    }
  };

  const handleCreate = () => {
    // Initialize any necessary state or perform additional actions
    toggleCreateForm(); // Toggle the visibility of the create form
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 4, backgroundColor: '#171717' }}>
        <CrudOperationsBanner />
        <Dropdown selectedTable={selectedTable} handleTableChange={handleTableChange} />
        <OperationButtons handleCreate={handleCreate} handleRead={handleRead} />
        {loading && <CircularProgress />}
        {error && <p>{error}</p>}
        {!isCreating && selectedTable && tableData.length > 0 && !loading && !error && (
          <TablePage data={tableData} columns={columns} />
        )}
        {isCreating && (
          <CreateForm
            columns={columns}
            selectedTable={selectedTable}
            onCreate={handleFormSubmit}
          />
        )}
      </Box>
    </ThemeProvider>
  );  
}
export default App;