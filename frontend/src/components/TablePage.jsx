import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function TablePage({ data, columns }) {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={index}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={row.id || rowIndex}>
                            {columns.map((column, colIndex) => (
                                <TableCell key={`${rowIndex}-${colIndex}`}>
                                    {column === 'Comment' ? (
                                        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{row[column] || 'N/A'}</div>
                                    ) : (
                                        row[column] || 'N/A'
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TablePage;
