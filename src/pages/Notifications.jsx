import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNotificationContext } from '../NotificationContext';
import { toast } from 'react-toastify'; // Import toast for user feedback

const Notifications = () => {
  const { notifications, removeNotification } = useNotificationContext();

  const handleRemove = (id) => {
    console.log(`Handle remove clicked for id: ${id}`); // Debugging log
    removeNotification(id)
      .then(() => {
        toast.success('Notification removed successfully!');
      })
      .catch(() => {
        toast.error('Failed to remove notification.');
      });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pond</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.pond}</TableCell>
                <TableCell>{notification.issue}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemove(notification.id)}>
                    <CheckIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Notifications;
