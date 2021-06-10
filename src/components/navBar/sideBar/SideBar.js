import React from 'react'
// Components
import UserSideBar from './userSideBar/UserSideBar'
import AdminSideBar from './adminSideBar/AdminSideBar'
// Redux
import { useSelector } from 'react-redux'
// Material UserSideBar
import { makeStyles } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

const drawerWidth = 300

const useStyles = makeStyles(() => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: 'white'
    }
  }))

const SideBar = () => {
    const isAdmin = useSelector(state => state.users.isAdmin)
    const classes = useStyles()
    const isOpen = useSelector(state => state.drawer.isOpen)

    return (
        <div>
            <Drawer className={classes.drawer} variant="persistent" anchor="left" open={isOpen}  classes={{ paper: classes.drawerPaper }}>
              {!isAdmin ? 
                <UserSideBar />
                : 
                <AdminSideBar />
              }
            </Drawer>
        </div>
    )
}

export default SideBar
