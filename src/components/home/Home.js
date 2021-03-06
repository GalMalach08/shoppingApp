import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Search from '../search/Search'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setIsAdmin, setProductsState, setDrawerState, setNoProducts } from '../../store/actions'
// Components
import NewUserModal from './newUserModal/NewUserModal'
import ProductCard from '../productCard/ProductCard'
import NoProduct from '../noProduct/NoProduct'
import Loader from '../loader/Loader'
// Material ui components
import { Grid, Grow } from '@material-ui/core'
import { makeStyles, StylesProvider } from '@material-ui/core/styles'
// React toastify 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Intro js
import { Steps } from 'intro.js-react'
import 'intro.js/introjs.css'
// Css
import './style.css'


// material ui style
const useStyles = makeStyles(() => ({
  root: {
    display:'flex',
    justifyContent:'center',
    margin:'30px'
  }
}))

 const Home = (props) => {
   const [category, setCategory] = useState('')
     // Intro js states
  const [firstEntry, setFirstEntry] = useState(false)
  const [stepsEnabled, setStepsEnabled] = useState(false)
  const [initialStep, setInitialStep] = useState(0)
  const [steps, setSteps] = useState([
      { element:'#stepOne', intro: 'Here you can add new products to the cart 🥳', position: 'left', highlightClass: 'add_cart_tooltip' },
      { element:'#stepTwo', intro: 'Increase the quantity in order to reach the desired quantity🥳', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepThree', intro: 'Try to serach for your desired product 🔍', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepFour', intro: 'navigate between the categories', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepFive', intro:'Here is your cart, threre you will find all the products you added 😎', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepSix', intro: 'and when you finish click here to move to the payment page', position: 'left', tooltipClass: 'myTooltipClass' },
  ])
  const products = useSelector(state => state.products.data)
  const noProducts = useSelector(state => state.products.noProducts)
  const cartProducts = useSelector(state => state.products.cartProducts)
  const user = JSON.parse(localStorage.getItem('user'))
  const cart = JSON.parse(localStorage.getItem('availableCart'))
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()



  // Get all the products
  const getProducts = async () => {
    try {
      const id = props.match.params.id
      if(id !== 'search') {
      dispatch(setNoProducts(false))
      const res = await fetch(`https://shoppingappmalach.herokuapp.com/product/${id}`)
      const { products } = await res.json()
      setCategory(products[0].Category.name)
      const response = await fetch(`https://shoppingappmalach.herokuapp.com/cart/${cart.id}`)
      const data  = await response.json()
      const productsArr = []
      products.forEach(product => {
        const productObj = {
          ...product,
        }
        const isInCart = data.cart.CartItems.find(item => item.ProductId === product.id)
        if(isInCart) {
          productObj.quantity = isInCart.amount
          productObj.isInCart = true
        } else {
          productObj.quantity = 1
        }
        productsArr.push(productObj)
      })
      dispatch(setProductsState(productsArr))
    } else {
      setCategory('Search Results')
      const value = props.location.search.split('=')[1]
      const res = await fetch(`https://shoppingappmalach.herokuapp.com/product/search`, { method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({ value })
    })
    const { products } = await res.json()
    if(products.length > 0) {
    const response = await fetch(`https://shoppingappmalach.herokuapp.com/cart/${cart.id}`)
    const data  = await response.json()
    const productsArr = []
    products.forEach(product => {
      const productObj = {
        ...product,
      }
      const isInCart = data.cart.CartItems.find(item => item.ProductId === product.id)
      if(isInCart) {
        productObj.quantity = isInCart.amount
        productObj.isInCart = true
        console.log(productObj);
      } else {
        productObj.quantity = 1
      }
      productsArr.push(productObj)
    })
    dispatch(setProductsState(productsArr))
    history.push({
      pathname: '/products/search',
      search: `?value=${value}`
    })
    } else {
      dispatch(setNoProducts(true))
    }
  }
    } catch(err) {
      console.log(err)
    }
  }

  // intro js functions
  const onExit = () => {
    setStepsEnabled(false)
    setFirstEntry(false)
  }

  const handleSteps = (step) => {
    step === 1 && window.scrollTo(0,0)
    step === 2 && dispatch(setDrawerState(true))  
  }

  useEffect(() => {
    getProducts()
  }, [props.match.params.id])


  useEffect(() => {
    getProducts()
    user.admin ? dispatch(setIsAdmin(true)) : dispatch(setIsAdmin(false))
   if (user.newUser) {
    setFirstEntry(true)
    delete user['newUser']
    localStorage.setItem('user', JSON.stringify(user)) 
   } else if(cartProducts.length > 0)  {
    dispatch(setDrawerState(true))
   }
  }, [])

  useEffect(() => {
    getProducts()
  }, [props.match.params.id])



  return (
    <>
    <div className="search_div">
    <Search />
    </div>
      {category && <div className="home_header"> <h1 className="category_name">{category}</h1> </div> }
      {firstEntry && products.length !== 0 ? 
      <>
      <NewUserModal stepsEnabled={stepsEnabled} setStepsEnabled={setStepsEnabled}/>
      <Steps enabled={stepsEnabled} steps={steps} initialStep={initialStep} onExit={onExit} onAfterChange={(step) => handleSteps(step)}/>
     </>
      : null}

      <StylesProvider injectFirst>
        <div className="container">
          <Grid container>
              {!noProducts && products ? 
                products.length !== 0 ?  products.map(product => (
                <Grow in={true}  timeout={700} key={product.id}>
                  <Grid item xs={11} lg={5}  className={classes.root}>
                    <ProductCard product={product} />
                  </Grid> 
                </Grow>
              )):  <Loader/> :  
                  <NoProduct/>
                }
            {/* ToastContainer */}
            <ToastContainer /> 
          </Grid>
        </div>
    </StylesProvider>
  </>
  )
}

export default Home
