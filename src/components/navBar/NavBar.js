import React from 'react'
// Components
import TopNavBar from './topNavBar/TopNavBar'
import SideBar from './sideBar/SideBar'
// Redux
import { useSelector } from 'react-redux'
// Material ui
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
// React toastify 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Css
import './style.css'

const drawerWidth = 300

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontFamily:'roboto'
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop:'10px',
    position:'sticky'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

const NavBar = () => {
  const isOpen = useSelector(state => state.drawer.isOpen)
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <TopNavBar />
      <SideBar />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isOpen,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>

       {/* ToastContainer */}
       <ToastContainer  draggable={false} /> 
    </div>
  )
}

export default NavBar
