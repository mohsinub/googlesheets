'use client'; // Important: Mark as client component

import { useState, useEffect } from 'react';
import axios from 'axios';
import {districts as dData } from '../data/data'

export default function Homepage({ selectedDistrict,setSelectedDistrict }) {
  const [sheetData, setSheetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRow, setNewRow] = useState({}); // For adding new rows
  const [districts, setDistricts] = useState(dData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sheets');
        setSheetData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post('/api/sheets', { newRow });
      setSheetData([...sheetData, newRow]);
      setNewRow({});
    } catch (err) {
      console.error('Error adding data:', err);
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete('/api/sheets', { data: { rowIndex: index } });
      const updatedData = sheetData.filter((_, i) => i !== index);
      setSheetData(updatedData);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  useEffect(() => {
    if (selectedDistrict != '') {
      const tempData = sheetData.filter((row) => row[4] == selectedDistrict);
      setFilteredData(tempData);
    } else {
      setFilteredData(sheetData);
    }
    }, [selectedDistrict,sheetData]);

    
console.log({as:sheetData});
console.log({filteredData});
console.log({selectedDistrict});


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sheet Data</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Filter by District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <option value="">All Districts</option>
            {districts?.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <div className="text-sm text-muted-foreground">Loading data...</div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center space-x-2 text-destructive">
            <span className="text-sm font-medium">Error loading data: {error.message}</span>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {sheetData[0]?.map((key, index) => (
                    <th key={index} className="px-4 py-3 text-left font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData?.slice(1)?.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {Object.values(row).map((value, index2) => (
                      <td key={index2} className="px-4 py-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}