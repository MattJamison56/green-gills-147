/* eslint-disable react/prop-types */
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Box, Typography } from '@mui/material';

const PondSelect = ({ selectedPond, handleSelectChange, pondStatuses, overallStatus }) => {

  // Basic function to set the dots next to the individual ponds
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box display="flex" alignItems="center">
      {/* The dropdown for the ponds */}
      <FormControl sx={{ width: '10%', margin: '10px' }}>
        <Select
          labelId="pond-select-label"
          id="pond-select"
          value={selectedPond}
          onChange={handleSelectChange}
          displayEmpty
        >
          <MenuItem value="">
            Select Pond
          </MenuItem>
          {Array.from({ length: 10 }, (_, i) => (
            <MenuItem key={i + 1} value={`Pond ${i + 1}`}>
              <Box display="flex" alignItems="center">
                <Box
                  width={10}
                  height={10}
                  borderRadius="50%"
                  bgcolor={getStatusColor(pondStatuses[`Pond ${i + 1}`])}
                  marginRight={1}
                />
                <Typography>Pond {i + 1}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        width={20}
        height={20}
        borderRadius="50%"
        bgcolor={overallStatus}
        marginLeft={2}
      />
    </Box>
  );
};

export default PondSelect;
