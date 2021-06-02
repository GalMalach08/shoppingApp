import React, { useState, useEffect } from 'react'
import { useLocation, Link, NavLink } from 'react-router-dom'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setCartProducts, updateTotalPrice, resetTotalPrice, setProductsState, setDrawerState, setProductToUpdate } from '../../store/actions'
// Formik
import { Formik } from 'formik'
import * as Yup from 'yup'
// Cloudinary
import { Image } from 'cloudinary-react'
// Components
import Search from '../search/Search'
// Material ui
import { TextField, Button, Divider, Select, MenuItem, IconButton, Drawer, Badge  , AppBar, Input, Collapse, Toolbar, Typography, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import CloseIcon from '@material-ui/icons/Close'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ImageIcon from '@material-ui/icons/Image'
import AddIcon from '@material-ui/icons/Add'
// React toastify 
import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Bootstrap
import { Nav, Navbar } from 'react-bootstrap'
// Css
import './style.css'
import { set } from 'lodash'

const drawerWidth = 300

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontFamily:'roboto'
  },
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
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'white'
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
  radio_btn_label: {
    textAlign:'left',
    marginTop:'5px',
  },
  radio_group: {
    display:'flex',
    flexDirection:'row',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const SideBarCart = () => {
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [isDelete, setIsDelete] = useState(true)
  const [imageName, setImageName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [disableButton, setDisableButton] = useState(false)
  const [categoryArr, setCategoryArr] = useState([])
  const [initialValues, setInitialValues] = useState({name:'', price: '', image: '', category: '', description: ''})
  const [selectedTypeOfPrice, setSelectedTypeOfPrice] = useState('product')
  const cartProducts = useSelector(state => state.products.cartProducts)
  const totalPrice = useSelector(state => state.products.totalPrice)
  const isAdmin = useSelector(state => state.users.isAdmin)
  const productToUpdate = useSelector(state => state.products.productToUpdate)
  const products = useSelector(state => state.products.data)
  const isOpen = useSelector(state => state.drawer.isOpen)
  const cart = JSON.parse(localStorage.getItem('availableCart'))
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
 
  
  // Form validation
  const validationSchema = Yup.object().shape({
    name:Yup.string()
    .required('name is required!'),
    description:Yup.string()
    .max(20,'you cant write that much!'),
    price:Yup.number()
    .required('price is required!'),
    image:Yup.string()
    .required('image is required!'),
    category: Yup.string()
    .required('category is required!'),
    perPrice: Yup.string()
    })

  const errorHelper = (formik,values) => ({
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })

         
  // Handle image change  
  const handleChangeImage = (e,setFieldValue) => {
    const reader = new FileReader()
    setFieldValue('image', e.target.files[0])
    if(e.target.files.length === 0) {
    setImageName('')
    setFieldValue('image','')
    } 
    else {
      reader.readAsDataURL(e.target.files[0])
      reader.onloadend = () => {
      setFieldValue('image',reader.result)
      }
      setImageName(e.target.files[0].name)
    }
}

  // Handle drawer state
  const handleDrawerOpen = () => dispatch(setDrawerState(true))
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

  // Get all the products in  the cart and set them to the cart products
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

  // Get all the categories 
  const getCategories = async () => {
    const res = await fetch('https://shoppingappmalach.herokuapp.com/category')
    const { categories } = await res.json()
    const categoryArr = []
    categories.forEach(category => categoryArr.push({ name: category.name, id: category.id }))
    setCategoryArr(categoryArr)
  }

  // Admin functions

  // Update product
  const updateProduct = async (values) => {
    setDisableButton(true)
    const CategoryId = categoryArr.find(category => category.name === values.category).id
    const priceInKg = selectedTypeOfPrice === 'kg' ? true: false
    const res = await fetch('https://shoppingappmalach.herokuapp.com/product',{ method: 'PATCH',
    headers: {
        'Content-Type':'application/json'
    },
    body: JSON.stringify({ ...values, imageName, CategoryId, priceInKg, id: productToUpdate.id })
    })
    const { product, error } = await res.json()
    if(error) {
      setMessage(error)
      setOpenAlert(true)
      setDisableButton(false) 
    } else {
    const productsArr = products
    const findIndex = productsArr.findIndex(item => item.id === product.id) 
    if(findIndex !== -1) { // if the product excist on the page
      if(`/products/${product.CategoryId}` === location.pathname || `/products/search` === location.pathname) { // if the category doesnt changed
        productsArr[findIndex] = { ...product, image: values.image }
        dispatch(setProductsState(productsArr))
      } else {
        const newProductsArr = productsArr.filter(item => item.id !== product.id)
        dispatch(setProductsState(newProductsArr))
      }
    } else if(`/products/${product.CategoryId}` === location.pathname)  { // if the product doesnt excist on the page but needs to be after the update
        productsArr.push( { ...product, image: values.image }) 
        dispatch(setProductsState(productsArr))
    }
    successToast('Product Updated! 😀')
    setDisableButton(false) 
   }
  }

  // Add product
  const addProduct = async (values, resetForm) => {
    console.log(resetForm);
    setDisableButton(true)
    const CategoryId = categoryArr.find(category => category.name === values.category).id
    const priceInKg = selectedTypeOfPrice === 'kg' ? true: false
    const res = await fetch('https://shoppingappmalach.herokuapp.com/product',{ method: 'POST',
    headers: {
        'Content-Type':'application/json'
    },
    body: JSON.stringify({ ...values, imageName, CategoryId, priceInKg })
})
    const { product, error } = await res.json()
    if(error) {
      setMessage(error)
      setOpenAlert(true)
      setDisableButton(false) 
    } else {
    if(`/products/${CategoryId}` === location.pathname) {
      const cartProductsArr = products
      cartProductsArr.push({ ...product, image: values.image, quanity:1 })
      dispatch(setProductsState(cartProductsArr))
    }
    successToast('Product Added! 😀')
    setDisableButton(false)
    resetForm()
    setImageName('')
  }
  }

  // Change the form from update to add
  const changeStatetoAdd = () => {
    dispatch(setProductToUpdate({}))
    setInitialValues({name:'', price: '', image: '', category: '', description: ''})
    setImageName('')
    setSelectedTypeOfPrice('product')
  }

  // Set the initial values to the update form
  useEffect(() => {
    if(productToUpdate.name) {
      console.log(productToUpdate);
    const { name, description, price, image, Category, imageName, priceInKg } = productToUpdate
    setInitialValues({ name, description, price, image, category: Category.name })
    setImageName(imageName)
    setSelectedCategory(Category.name)
    setSelectedTypeOfPrice(priceInKg ? 'kg' : 'product' )
    }
  }, [productToUpdate])


  useEffect(() => {
    if(isAdmin) {
      getCategories() 
    } else {
      getProducts()
    }
  }, [isAdmin])


  // disable the delete product option on the payment page
  useEffect(() => {
    location.pathname === '/payment' ? setIsDelete(false) : setIsDelete(true)
  }, [location.pathname])

  return (
    <div className={classes.root}>
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

      {/* Side bar */}
      <Drawer className={classes.drawer} variant="persistent" anchor="left" open={isOpen}  classes={{ paper: classes.drawerPaper }}>
        {!isAdmin ? 
        <>
        <div className={classes.drawerHeader}>
          <h3 className="cart_header" id="stepThree">Your Cart</h3>
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
          : 
          <>
          <div className="admin_panel_header">
          <h4 className="admin_panel_h1">Admin panel</h4>  
          <div>
          <IconButton title="add product" onClick={() => changeStatetoAdd() }>  <AddIcon/> </IconButton>
         <IconButton title="close sidebar" onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
        </div>
          <>
          <h5 className="action_header">{ productToUpdate.name ? 'Update product' : 'Add product' }</h5>
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
              enableReinitialize={true}>
              {(props) => (
                <form style={{textAlign:'center', margin:'10px'}} onSubmit={props.handleSubmit} autoComplete="off">
                  <div>
                    <TextField name="name" margin="normal" label="name" variant="outlined" fullWidth 
                    {...props.getFieldProps('name')} {...errorHelper(props,'name')}/>

                    <TextField name="description" margin="normal" label="description" variant="outlined" fullWidth 
                    {...props.getFieldProps('description')} {...errorHelper(props,'description')}/>

                    <TextField name="price" margin="normal" label="price" variant="outlined" fullWidth 
                    {...props.getFieldProps('price')} {...errorHelper(props,'price')}/>


                    <FormLabel component="legend" className={classes.radio_btn_label}>Price per</FormLabel>
                      <RadioGroup name="perPrice"  {...props.getFieldProps('perPrice')} {...errorHelper(props,'perPrice')} value={selectedTypeOfPrice} onChange={e => setSelectedTypeOfPrice(e.target.value)} className={classes.radio_group}>
                        <FormControlLabel value="product" control={<Radio />} label="product"/>
                        <FormControlLabel value="kg" control={<Radio />} label="kg"/>
                      </RadioGroup>
                

                    <Select defaultValue = "" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}  name="category" fullWidth  {...props.getFieldProps('category')}
                    {...errorHelper(props,'category')}>
                      {categoryArr.map(category => (
                        <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                      ))}
                    </Select>

                  <Input id="file" type="file" name="image" onChange={(e) => handleChangeImage(e,props.setFieldValue )} hidden/> 
                    <Button style={{display:'block', margin:'10px 0px'}} color='primary'  variant="outlined"><ImageIcon className=""/><label htmlFor="file">{imageName ? `${imageName} UPLOADED` : ' Product image'} </label></Button>
                   {props.errors.image && props.touched.image ?  <div className="error">{props.errors.image}</div>  : null} 
                </div>
                   {/* Error Alert */}
                   <Collapse in={openAlert}>
                      <Alert
                        severity="error"
                        action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                        {message}
                      </Alert>
                    </Collapse>
      
                  <Button
                  disabled={props.values.name && props.values.price && props.values.image && props.values.category && !disableButton && !props.errors.description ? false : true} 
                  className="my-3" variant="contained" color="primary" 
                  onClick={productToUpdate.name ? () => updateProduct(props.values) : () => addProduct(props.values, props.resetForm)} 
                  size="large" fullWidth> { productToUpdate.name ? 'Update product' : 'Add product' } </Button>
              </form> )}
            </Formik>  
            </>
          </> }

      </Drawer>
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
    
    
  );
}

export default SideBarCart
