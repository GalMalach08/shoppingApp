import React from 'react'
// Material ui
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
// Css
import './style.css'

const Loader = () => {
    return (
        <>
        <div className="overlay"></div>
        <div className="loaders"> <LocalGroceryStoreIcon fontSize="large" style={{fill:"grey"}}/> </div>
        </>
    )
}

export default Loader
