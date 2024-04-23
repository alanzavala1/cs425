import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'; // Import MUI components

function TablePage({ data, columns }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow key={row.id}>
                            {columns.map(column => (
                                <TableCell key={column}>
                                    {column === 'Comment' ? (
                                        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>{row[column]}</div>
                                    ) : (
                                        row[column]
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
