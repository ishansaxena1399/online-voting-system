import { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';
import useGlobalState from '../store';
import { logoutUser } from '../store/actions';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import AdminMenu from "./adminMenu";
import HomeIcon from '@mui/icons-material/Home';

const Navigation = () => {

  const {
    dispatch,
    state: {
      user: {
        details,
        isLoggedIn
      }
    }
  } = useGlobalState();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openNav, setOpenNav] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  }

  const toggleNavDrawer = () => setOpenNav(!openNav);

  return (
    <>
      <div className={(pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") ? 'loggedOutNavBar' : 'navigationBar'} >
        {
          <div className="leftMenu" >
            {
              isLoggedIn &&
              details.role === "admin" &&
              <MenuIcon className="menuIcon" onClick={toggleNavDrawer} />
            }

            {
              (pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") &&
              <p className='navigationTitle' >
                Online Voting {(details && details.role) === "admin" ? "Admin Portal" : "System"}
              </p>
            }
          </div>
        }

        {
          (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") && !isLoggedIn &&
          <div className="loggedOutLeftMenu" >
            <HomeIcon />
            <Link to="/home" >
              Home
            </Link>
          </div>
        }

        {
          isLoggedIn ?
            <div className="rightNav" >
              <p className="navigationTitle" >Hi, {details.name} 👋</p>
              <Tooltip
                arrow
                title="Logout"
              >
                < IconButton onClick={handleLogout} >
                  <LogoutIcon className='logoutIcon' />
                </IconButton>
              </Tooltip>
            </div>
            :
            pathname !== "/login" ?
              <Link to="/login" className="logintext" >Login</Link>
              :
              null
        }
      </div >

      {
        < Drawer
          anchor="left"
          open={openNav}
          onClose={toggleNavDrawer}
        >
          <AdminMenu />
        </Drawer >
      }
    </>
  )
}

export default Navigation;