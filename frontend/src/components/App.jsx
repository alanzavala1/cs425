import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from '../theme/theme';
import CrudOperationsBanner from './CrudOperationsBanner';
import Dropdown from './Dropdown';
import OperationButtons from './OperationButtons';
import axios from 'axios';
import UserPage from './UserPage'; // Import the TablePage component

function App() {
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);

    const handleTableChange = (event) => setSelectedTable(event.target.value);

    const tableColumnMapping = {
        User: ['UserID', 'Username', 'Email', 'Password', 'RegistrationDate', 'LastLoginDate', 'DeliveryAddress'],
        Product: ['ProductID', 'Title', 'Description', 'Price', 'Conditionn', 'CategoryID', 'SellerID', 'ShippingAddress'],
        Bid: ['BidID', 'ProductID', 'UserID', 'BidAmount', 'BidTime'],
        Transaction: ['TransactionID','BuyerID', 'SellerID', 'ProductID', 'TransactionDate', 'Quantity','EstimatedDeliveryDate', 'Delivered', 'DeliveryAddress', 'ShippingAddress'],
        Category: ['CategoryID', 'CategoryName'],
        Review: ['ProductID', 'UserID', 'Rating', 'Comment', 'ReviewDate'],
      };
    
    // Update the handleRead function to fetch the column names for the selected table
    const handleRead = async () => {
        setLoading(true);
        setError(null);
    
        try {
        const response = await axios.get(`http://localhost:8000/${selectedTable.toLowerCase()}/`);
        setTableData(response.data);
        // Get the corresponding column names for the selected table
        const columns = tableColumnMapping[selectedTable];
        
        setColumns(columns); // assuming you have a state variable for columns
        } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
        } finally {
        setLoading(false);
        }
    };
    
    


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 4,  backgroundColor: '#ffffff' }}>
                <CrudOperationsBanner />
                <Dropdown selectedTable={selectedTable} handleTableChange={handleTableChange} />
                <OperationButtons handleRead={handleRead} />
                {loading && <CircularProgress />} {/* Show loading indicator */}
                {error && <p>{error}</p>} {/* Show error message */}
                {selectedTable && !loading && !error && <UserPage data={tableData} columns={columns} />}
            </Box>
        </ThemeProvider>
    );
}

export default App;
