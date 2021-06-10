import React from 'react'
import { Link, NavLink } from 'react-router-dom'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerState  } from '../../../store/actions'
// Components
import Search from '../../search/Search'
// Material ui
import { IconButton, Badge  , AppBar, Toolbar, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
// Bootstrap
import { Nav, Navbar } from 'react-bootstrap'
// Css
import './style.css'

const drawerWidth = 300 

const useStyles = makeStyles((theme) => ({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: 'white',
      color:'black'
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      marginBottom:'20px',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
  },
    title: {
        color:'black', 
        display:'inline'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    }
  }))

const TopNavBar = () => {

    const classes = useStyles()
    const isOpen = useSelector(state => state.drawer.isOpen)
    const dispatch = useDispatch()
    const cartProducts = useSelector(state => state.products.cartProducts)

  // Handle drawer state
  const handleDrawerOpen = () => dispatch(setDrawerState(true))
    return (
        <>
              {/* Top navbar */}
      <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: isOpen})}>
        <Toolbar>
          <Navbar bg="white" expand="xl" className="navbar">
              <Navbar.Brand className="navbar_brand">
                <IconButton color="inherit" onClick={handleDrawerOpen} edge="start" className={clsx(classes.menuButton, isOpen && classes.hide)}>
                  <Badge badgeContent={cartProducts.length} color="primary">
                    <ShoppingCartIcon/>
                  </Badge>
                </IconButton>
                <Link to="/products/1" style={{ textDecoration: 'none'}}>
                  <Typography className={classes.title} variant="h6" noWrap> ShoppingApp </Typography>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse className="navbar_collapse">
                <Nav className="mr-auto w-100 d-flex justify-content-around">
                 
                            <NavLink to="/products/5" className="nav_link" activeClassName="selected">
                              <IconButton color="inherit" className={classes.iconButton}>
                              <span className={ isOpen ? "link_desc_small" :"link_desc"}>Dairy And Eggs</span>
                              </IconButton>
                            </NavLink>
                       
                            <NavLink to="/products/15"  className="nav_link" activeClassName="selected" id="stepFive">
                              <IconButton color="inherit">
                              <span  className={ isOpen ? "link_desc_small" :"link_desc"}>Meat And Fish</span>
                              </IconButton>
                            </NavLink>
                 
                            <NavLink to="/products/25" className="nav_link" activeClassName="selected">
                              <IconButton color="inherit">
                              <span className={ isOpen ? "link_desc_small" :"link_desc"}>Drinks And Alcohol</span>
                              </IconButton>
                            </NavLink>
                      
                            <NavLink to="/products/35"  className="nav_link" activeClassName="selected">
                              <IconButton color="inherit">
                              <span className={ isOpen ? "link_desc_small" :"link_desc"}>Fruits And Vegetables</span>
                              </IconButton>
                            </NavLink>

                            <NavLink to="/logout" className="nav_link" activeClassName="selected">
                              <IconButton color="inherit">
                                <ExitToAppIcon/> <span className={ isOpen ? "link_desc_small" :"link_desc"}>Logout</span>
                              </IconButton>
                          </NavLink>

                          <div className={classes.searchLink}> <Search/> </div> 
              
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
          </Toolbar>
      </AppBar>
        </>
    )
}

export default TopNavBar
