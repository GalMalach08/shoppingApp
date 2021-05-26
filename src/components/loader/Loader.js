import React from 'react'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
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
