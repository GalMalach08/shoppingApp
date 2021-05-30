import React, { useState } from 'react'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setProductToUpdate, setCartProducts, addCartProducts, updateTotalPrice, setProductsState, setDrawerState } from '../../store/actions'
// Material ui
import { makeStyles } from '@material-ui/core/styles'  
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
// React toastify 
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Cloudinary
import { Image } from 'cloudinary-react'
// Css
import './style.css'

const useStyles = makeStyles(() => ({
    icon: {
      cursor:'pointer',
      margin:'0px 5px',
       "&:hover": {
        backgroundColor: '#F5F3F3',
        borderRadius:'100px',
      }
    }
  }))     
  
const ProductCard = ({ product }) => {
    const [addToCartButtonDisabled, setAddToCartButtonDisabled] = useState(false)
    const products = useSelector(state => state.products.data)
    const cartProducts = useSelector(state => state.products.cartProducts)
    const isAdmin = useSelector(state => state.users.isAdmin)
    const cart = JSON.parse(localStorage.getItem('availableCart'))
    const classes = useStyles()
    const dispatch = useDispatch()

    // Toastify
    const successToast = (message) => {
     toast(message, { 
      draggable: true, 
      position: toast.POSITION.BOTTOM_RIGHT,
      transition: Zoom,
      autoClose: 2000
      })
    }

    // Add product to cart or update excisting one
    const addToCart = async (id, amount, price) => {
      setAddToCartButtonDisabled(true)
      const response = await fetch('https://shoppingappmalach.herokuapp.com/cart_item', { 
        method: 'POST',
        headers: {
         'Content-Type':'application/json'
       },
       body: JSON.stringify({ amount, price: price * amount, ProductId: id, CartId: cart.id })
       })
       const { cartItem } = await response.json() 
       console.log(cartItem)
       if(cartItem) {
        const cartItemsArr = cartProducts
        const changedItem = cartItemsArr.find(item => item.id === cartItem.ProductId)
        if(changedItem) {
          dispatch(updateTotalPrice( (amount - changedItem.amount ) * price ))
          changedItem.amount = amount
          changedItem.totalPrice = price * amount
          dispatch(setCartProducts(cartItemsArr))
          successToast('Product updated in cart! 😀')
        } else {
         const newProductInCart = { 
           id: cartItem.ProductId,
           name: cartItem.Product.name,
           singlePrice: cartItem.Product.price,
           amount: cartItem.amount,
           totalPrice:cartItem.price,
           image: cartItem.Product.image,
           priceInKg: cartItem.priceInKg
         }
          const productArr = products
          const addedProduct = productArr.find(item => item.id === id)
          addedProduct.isInCart = true
          dispatch(setProductsState(productArr))
          dispatch(addCartProducts(newProductInCart))
          dispatch(updateTotalPrice(newProductInCart.totalPrice))
          successToast('Product added to cart! 😀')
        }
        setAddToCartButtonDisabled(false)
       }
    }

    // Reduce the quantity of product
    const reduceQuantity = (id) => {
      const productsArr = products
      const product = productsArr.find(product => product.id === id)
      product.quantity -= 1
      dispatch(setProductsState(productsArr))
    }
  
    // Add to the quantity of product
    const addQuantity = (id) => {
      const productsArr = products
      const product = productsArr.find(product => product.id === id)
      product.quantity += 1
      dispatch(setProductsState(productsArr))
    }

    // Admin functions

    // Update product details
    const updateProduct = (id) => {
      const productToUpdate = products.find(product => product.id === id)
      dispatch(setProductToUpdate(productToUpdate))
      dispatch(setDrawerState(true))
    }

    return (
      <>
      {product.image &&
      <div class="contain">
        <Image cloudName="malachcloud" src={product.image} width="250" height="200" crop="scale" />
        <h3 className="product_header">{product.name}</h3>
        <p className="product_paragraph">{product.description}</p>
        <div class="properties">
          {!isAdmin &&
            <div class="qty">
              <h4 >Quantity</h4>
              {product.quantity > 1 && <RemoveIcon className={classes.icon} fontSize="small" color="action"   onClick={() => reduceQuantity(product.id)} /> }
              <span class="number">{product.quantity}</span>
              <AddIcon className={classes.icon} fontSize="small" color="action"  onClick={() => addQuantity(product.id)} id="stepTwo"/>
            </div> }

            <div class="price">
              <h4>Price</h4>
              <span class="price-inr">
                <i class="fa fa-inr"></i>
                <span class="amount">${product.price} <small>{product.priceInKg ? 'per kg' : 'per unit'}</small></span>
              </span>
            </div>

            {!isAdmin &&
            <div class="price">
              <h4>Total</h4>
              <span class="price-inr">
                <i class="fa fa-inr"></i>
                <span class="amount">${(+product.price * +product.quantity).toFixed(2)}</span>
              </span>
            </div> }
        </div>
    
      {!isAdmin && <button class="ip-add-cart" type="button" disabled={addToCartButtonDisabled} onClick={() => addToCart(product.id, product.quantity, product.price )}  id="stepOne"> {product.isInCart ? 'Update' : 'Add to cart'} </button>}
      {isAdmin && <input class="ip-add-cart" type="button" value="Update product" onClick={() => updateProduct(product.id)} /> }
    </div> }	
   </>
    )
}

export default ProductCard
