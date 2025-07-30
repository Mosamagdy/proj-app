'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/lib/store';
import { getUserData, logout, addToken } from '@/lib/AuthSlice'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faMessage, faGear } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../../public/public/imgs/a9518600-193f-4f39-bdff-f8d68130cdec_removalai_preview.png';

const publicSettings = [
  { path: '/login', name: 'Login' },
  { path: '/Register', name: 'Register' },
];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { token, userData } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
  const dispatch = useDispatch();

 
  React.useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      dispatch(addToken(savedToken)); 
      dispatch(getUserData());
    }
  }, [dispatch]);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");

 
    localStorage.removeItem("token");


    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    
    dispatch(logout());


    window.location.href = '/login';
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1A1A1A' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src={logo.src} alt="Logo" sx={{ width: 80, mr: 1, cursor: 'pointer' }} />
          </Link>

          {token && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <MenuItem>
                <Link href="/Post" style={{ textDecoration: 'none', color: 'white' }}>
                  <FontAwesomeIcon icon={faHouse} />
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/Messages" style={{ textDecoration: 'none', color: 'white' }}>
                  <FontAwesomeIcon icon={faMessage} />
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/Settings" style={{ textDecoration: 'none', color: 'white' }}>
                  <FontAwesomeIcon icon={faGear} />
                </Link>
              </MenuItem>
            </Box>
          )}

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {!token ? (
              publicSettings.map((setting) => (
                <MenuItem key={setting.path}>
                  <Typography component={Link} href={setting.path} sx={{ textAlign: 'center', color: 'white' }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))
            ) : (
              <>
                <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
                  Welcome: {userData?.name}
                </Typography>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src={userData?.photo} />
                  </IconButton>
                </Tooltip>
                <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                  <MenuItem onClick={handleLogout}>
                    <Typography component="span" sx={{ textAlign: 'center' }}>LogOut</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;