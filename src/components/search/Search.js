import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setProductsState, setNoProducts } from '../../store/actions'
// Material ui
import { makeStyles } from '@material-ui/core/styles'
import { Button, InputBase, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'



const useStyles = makeStyles((theme) => ({
    search: {
      display: 'flex',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: 'whitesmoke',
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      width: '348px !important',
      // width: 'auto',
      color:'black',
      margin: '10px 0px',
      [theme.breakpoints.up('lg')]: {
        width: 'auto !important',
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'right',
    },
    inputRoot: {
      color: 'inherit',
      fontSize: '13px'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sortBtn: {
      padding:'0px 8px 8px'
    }
   
    
  }))

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const cartProducts = useSelector(state => state.products.cartProducts)
    const dispatch = useDispatch()
    const history = useHistory()
    const classes = useStyles()
  
    const clearInput = () => {
      setSearchValue('') 
    }
  
    const findProducts = async () => {
      setButtonDisabled(true)
      const res = await fetch(`https://shoppingappmalach.herokuapp.com/product/search`, { method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({ value: searchValue })
    })
    const { products } = await res.json()
    if(products.length > 0) {
      dispatch(setNoProducts(false))
      products.forEach(product => {
        const isInCart = cartProducts.find(item => item.id === product.id)
        if(isInCart) {
         product.quantity = isInCart.amount
         product.isInCart = true
        } else {
         product.quantity = 1
        }
      })
    } else {
      dispatch(setNoProducts(true))
    }
    setButtonDisabled(false)
    history.push('/products/search')
    dispatch(setProductsState(products))
    }

    return (
        <>
           <div className={classes.search} id='stepFour'>
            <div className={classes.searchIcon}>  <SearchIcon />  </div>
        
            <InputBase
              type='text'
              value={searchValue}
              onChange={e =>  setSearchValue(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
            <Button color="primary" onClick={findProducts} disabled={!searchValue || buttonDisabled}>Search</Button>
           <IconButton onClick={() => clearInput() }> <ClearIcon fontSize="small"/> </IconButton> 
           
          </div>
        </>
    )
}

export default Search
