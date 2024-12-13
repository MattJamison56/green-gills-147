import { useThresholdContext } from '../ThresholdContext';
import { TextField, Box, Typography, Checkbox, FormControlLabel, Container, Button } from '@mui/material';
import { useEffect, useState } from 'react';

const Settings = () => {
  const { thresholds, setThresholds, saveThresholds } = useThresholdContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (thresholds.notifs !== undefined) {
      setNotificationsEnabled(thresholds.notifs === 1);
    }
  }, [thresholds]);

  const handleThresholdChange = (event) => {
    const { name, value } = event.target;
    setThresholds(prevThresholds => ({
      ...prevThresholds,
      [name]: parseFloat(value)
    }));
  };

  const handleNotificationChange = (event) => {
    const isChecked = event.target.checked;
    setNotificationsEnabled(isChecked);
    setThresholds(prevThresholds => ({
      ...prevThresholds,
      notifs: isChecked ? 1 : 0
    }));
  };

  const handleSaveChanges = () => {
    saveThresholds(thresholds);
  };
  
  return (
    <div>
      <h2>Settings</h2>
      <Container sx={{ display: 'flex'}}>
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Temperature Threshold
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 2, margin: '1.5em'}}>
            <TextField
                label="Low(°F)"
                type="number"
                name="temp_low"
                value={thresholds.temp_low}
                onChange={handleThresholdChange}
                variant="outlined"
                fullWidth
            />
            <TextField
              label="High(°F)"
              type="number"
              name="temp_high"
              value={thresholds.temp_high}
              onChange={handleThresholdChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Typography variant="h5" gutterBottom>
            TDS Threshold
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 2, margin: '1.5em'}}>
            <TextField
              label="High"
              type="number"
              name="tds_high"
              value={thresholds.tds_high}
              onChange={handleThresholdChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Typography variant="h5" gutterBottom>
            pH Threshold
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 2, margin: '1.5em'}}>
            <TextField
              label="Low"
              type="number"
              name="ph_low"
              value={thresholds.ph_low}
              onChange={handleThresholdChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="High"
              type="number"
              name="ph_high"
              value={thresholds.ph_high}
              onChange={handleThresholdChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={notificationsEnabled}
                onChange={handleNotificationChange}
                name="notificationsEnabled"
                color="primary"
              />
            }
            label="Enable Notifications"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, marginTop: '-0.5em' }}>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Box>
        </Box>
        {/* TODO: Allow adding and removal of ponds */}
        {/* <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Add/Remove Pond
          </Typography>
        </Box> */}
      </Container>
    </div>
  );
};

export default Settings;
