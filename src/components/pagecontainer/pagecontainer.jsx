/* eslint-disable react/prop-types */
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import { mainListItems } from './listitems';
import logo from '../../assets/rf-logo.png';
import DashboardPage from '../../pages/DashboardPage';
import Statistics from '../../pages/Statistics';
import Settings from '../../pages/Settings';
import Notifications from '../../pages/Notifications';
import { useNotificationContext } from '../../NotificationContext';


const drawerWidth = 240;

// Don't worry about this. Just forces theme for the pull out menu.
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#175616',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// The drawer with custom styling based on if open or closed
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// NOT A DASHBOARD. This is the page container
export default function Dashboard({ data }) {
  const [open, setOpen] = useState(false); // controls the state of sidebar menu
  const { notifications } = useNotificationContext();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            {/* the hamburger menu button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* the title of the page container */}
            {/* TODO: make dynamic to the page its on */}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 0.8 }}
            >
              {/*Title of page*/}
            </Typography>
            
            {/* logo on top */}
            <img src={logo} alt="RF Logo" style={{ height: '50px' }} />
            <Box sx={{ flexGrow: 0.80 }} /> {/* This Box will take up the remaining space to center the logo */}
            
            {/* notif button */}
            <IconButton color="inherit" component={Link} to='/notifications'>
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

          </Toolbar>
        </AppBar>
        

        {/* Where the sidebar icons are stored on the side */}
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems} {/* from the listitems file. basically just the menu options */}
          </List>
        </Drawer>
        
        {/* This is the box that houses the actual page the user is on*/}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            width: '100vw',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="x-lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<DashboardPage data={ data }/>} />
              <Route path="/statistics" element={<Statistics data={ data }/>} />
              <Route path="/settings" element={<Settings/>} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}