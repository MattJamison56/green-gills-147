/* eslint-disable react/prop-types */
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Uses the data and keys to make a chart
// Allows selecting the number of entries to display (10, 50, 100)
const DataChart = ({ name, data, dataKeyX, dataKeyY }) => {
  // State to manage the selected limit
  const [limit, setLimit] = useState(10);

  // Handle dropdown selection changes
  const handleChange = (event) => {
    setLimit(event.target.value);
  };

  // Slice the data based on the selected limit
  const limitedData = data.slice(-limit);

  return (
    <Box sx={{ width: 'auto', height: 500, margin: 5 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {name}
      </Typography>

      {/* Dropdown to select the number of entries */}
      <Box sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id={`${name}-select-label`}>Entries</InputLabel>
          <Select
            labelId={`${name}-select-label`}
            id={`${name}-select`}
            value={limit}
            onChange={handleChange}
            label="Entries"
          >
            <MenuItem value={10}>Last 10</MenuItem>
            <MenuItem value={50}>Last 50</MenuItem>
            <MenuItem value={100}>Last 100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={limitedData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={dataKeyX} 
            tick={false} 
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKeyY} stroke="#175616" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DataChart;
