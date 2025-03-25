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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="mt-2 text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Sheet Data</h1>
      <div className="flex items-baseline justify-left mb-4 gap-3">
      <h4 className="text-xl font-bold mb-4">Filter by District</h4>
      <select
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">All Districts</option>
        {districts?.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))} 
      </select>
      </div>
      {filteredData && filteredData.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr className="">
                {
                  filteredData[0]?.map((key, index) => (
                    <th key={index} className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))
                }
                {/* <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData?.slice(1)?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(row).map((value, index2) => (
                    <td key={index2} className="px-3 py-1 whitespace-nowrap text-xs text-gray-500">
                      {value}
                    </td>
                  ))}
                  {/* <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-0 rounded-md"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table> 
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}

      {/* <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Add New Row</h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredData[0]?.map((key, index) => (
            <input
              key={index}
              className="border p-2 rounded-md"
            />
          ))}
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Row
        </button>
      </div> */}
    </div>
  );
}