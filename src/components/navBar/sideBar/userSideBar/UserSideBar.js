import React, { useState, useEffect } from 'react'
// React router
import { Link, useLocation } from 'react-router-dom' 
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setCartProducts, updateTotalPrice, resetTotalPrice, setProductsState, setDrawerState } from '../../../../store/actions'
// Material ui
import { Button, Divider, IconButton} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
// React toastify 
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Cloudinary
import { Image } from 'cloudinary-react'

const useStyles = makeStyles((theme) => ({
    drawerHeader: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop:'10px',
      position:'sticky'
    }
  }))

function UserSideBar() {
  const [isDelete, setIsDelete] = useState(true)
  const products = useSelector(state => state.products.data)
  const cartProducts = useSelector(state => state.products.cartProducts)
  const totalPrice = useSelector(state => state.products.totalPrice)
  const cart = JSON.parse(localStorage.getItem('availableCart'))
  const dispatch = useDispatch()
  const location = useLocation()
  const classes = useStyles()  
  const handleDrawerClose = () => dispatch(setDrawerState(false))


  // Toastify
  const successToast = (message) => {
    toast(message, { 
     draggable: true, 
     position: toast.POSITION.BOTTOM_RIGHT,
     transition: Zoom,
     autoClose: 2000
    })
  }
  // Clear the cart
  const clearCart = async () => {
    const res = await fetch('https://shoppingappmalach.herokuapp.com/cart_item/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ id: cart.id })
      })
    const { success } = await res.json()
    if(success) {
      const productsArr = products
      productsArr.forEach(product => {
        product.quantity = 1
        product.isInCart = false
      })
     dispatch(setCartProducts([]))
     dispatch(resetTotalPrice())
     successToast('Cart cleared! 😀')
    }
  }

  // Remove specific item from the cart
  const removeFromCart = async (id) => {
    const res = await fetch('https://shoppingappmalach.herokuapp.com/cart_item', {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ CartId: cart.id, ProductId: id })
      })
    const { success } = await res.json()
    if(success) {
     const productsArr = products
     const deletedItemInProducts = productsArr.find(item => item.id === id)
     if(deletedItemInProducts) {
      deletedItemInProducts.isInCart = false
      deletedItemInProducts.quantity = 1
      dispatch(setProductsState(productsArr))
     }
  
     const deletedItemInCart = cartProducts.find(item => item.id === id)
     console.log(deletedItemInCart.totalPrice);
     const cartProductsArr = cartProducts.filter(item => item.id !== id)
     dispatch(setCartProducts(cartProductsArr))
     dispatch(updateTotalPrice(-deletedItemInCart.totalPrice))
     successToast('Product removed! 😀')
   }
  }
  const getProducts =  async () => {
    const res = await fetch(`https://shoppingappmalach.herokuapp.com/cart/${cart.id}`)
    const data  = await res.json()
    const itemsArr = []
    let count = 0
    data.cart.CartItems.forEach(item => {
      const cartItem = {
        id: item.ProductId,
        name: item.Product.name,
        singlePrice: item.Product.price,
        totalPrice: item.amount * item.Product.price,
        amount: item.amount,
        image: item.Product.image
      }
      count += cartItem.totalPrice
      itemsArr.push(cartItem)
    })
    if(count !== totalPrice) {
      dispatch(updateTotalPrice(count))
    }
    dispatch(setCartProducts(itemsArr))   
  }


  useEffect(() => {
    getProducts()
  }, [])
    // disable the delete product option on the payment page
    useEffect(() => {
      location.pathname === '/payment' ? setIsDelete(false) : setIsDelete(true)
    }, [location.pathname])
    return (
        <>
             <div className={classes.drawerHeader}>
          <h3 className="cart_header" id="stepFive">Your Cart</h3>
          <div>
            <IconButton title="close sidebar" onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
        </div>
        <Divider />
        <div className="summary_card">
          {cartProducts.map(product => (
            <div className="card_item" key={product.id}>
              <div>
                <Image className="product_img"  cloudName="malachcloud" src={product.image} width="70" height="40" crop="scale" />
              </div>
              <div className="product_info">
                <h6>{product.name}</h6>
                <h6>quanity: {product.amount}</h6>
                <h6>total price: {Number(product.totalPrice).toFixed(2)}$</h6>
              </div>
              <div>
                { isDelete && <IconButton onClick={() => removeFromCart(product.id)}> <CloseIcon/> </IconButton> }
              </div>
            </div>
            ))}
          </div>

          {totalPrice === 0 ?
            <h5 className="m-2">Your cart is empty</h5>
           :
            <h5 className="ml-2"><span className="total_price_span"> Total price: </span> ${totalPrice.toFixed(2)}</h5>
          }
    
          <div className="btn-group">
          <Link to="/payment" style={{ textDecoration: 'none', pointerEvents: totalPrice === 0 || !isDelete ? 'none' : ''}}>
            <Button variant="outlined" color="primary" className="m-2" disabled={totalPrice === 0 || !isDelete} id="stepSix" onClick={() => dispatch(setProductsState([]))}> Payment page </Button>
          </Link> 
            <Button variant="outlined" color="secondary" onClick={clearCart}  className="m-2" disabled={totalPrice === 0 || !isDelete}> Clear cart </Button>
          </div>
          </>
        
    )
}

export default UserSideBar
