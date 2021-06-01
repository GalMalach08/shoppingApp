import React,{ useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
// Component
import Loader from '../loader/Loader' 
// Material ui components
import { Grid, TextField, Button, Paper, Collapse, IconButton, InputAdornment, ListItemAvatar,
Avatar, ListItem, List, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
// Material ui icons
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import KitchenIcon from '@material-ui/icons/Kitchen'
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation'
import CloseIcon from '@material-ui/icons/Close'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import MoneyOffIcon from '@material-ui/icons/MoneyOff'
import PaymentIcon from '@material-ui/icons/Payment'
import HomeWorkIcon from '@material-ui/icons/HomeWork'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
// Formik
import { useFormik } from 'formik'
import * as Yup from 'yup'
// Card flip
import ReactCardFlip from 'react-card-flip';
// Css
import './style.css'

  
const useStyles = makeStyles((theme) => ({
    root: {
      marginTop:'20px',
    },
    formGrid: {
      margin:'70px 15px '
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    longMessage: {
      marginTop:'50px',
      fontWeight:'600'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    header: {
      textAlign: 'center',
      margin: theme.spacing(2),
      fontFamily: 'Chilanka'
    }
}))


const SignIn = ({ setIsAuth }) => {
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [buttonStartDisabled, setButtonStartDisabled] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [numberOfProducts, setnumberOfProducts] = useState(null)
    const [numberOfOrders, setNumberOfOrders] = useState(null)
    const [availableCart, setAvailableCart] = useState(null)
    const [availableCartSum, setAvailableCartSum] = useState(null)
    const [userLastOrder, setUserLastOrder] = useState(null)
    const [newUser, setNewUser] = useState(null)
    const [productsImages, setProductsImages] = useState([])
    const [isFlipped, setIsFlipped] = useState(false)
    const [dense, setDense] = useState(false)
    const [isUserAuth, setIsUserAuth] = useState(false)
    const history = useHistory()
    const classes = useStyles()

    // Formik
    const formik = useFormik({
      initialValues:{username:'',password:''},
      validationSchema:Yup.object({
          username:Yup.string()
          .required('sorry username is required'),
          password:Yup.string()
          .required('password is required')
          .min(6, 'password have to be at least 6 characters long')
      }),
      onSubmit:(values,{resetForm}) => {                               
        loginUser(values)
      }
    })

    const errorHelper = (formik,values) => ({
        error: formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
    })
  
    // Handle password visibility
    const  handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }

    // Getting the number of porducts in the store
    const getNumberOfProducts = async () => {
      const res = await fetch('https://shoppingappmalach.herokuapp.com/product')
      const { products } = await res.json()
      for (let i = 0; i < 2; i++) {
        setProductsImages([...productsImages, products[i].image]) 
      }
      setnumberOfProducts(products.length - 1)
     }

    // Getting the number of orders in the store
    const getNumberOfOrders = async () => {
      const res = await fetch('https://shoppingappmalach.herokuapp.com/order')
      const { orders } = await res.json()
      setNumberOfOrders(orders.length - 1)
    }
   
    // Log in user
    const loginUser = async (values) =>{
      try {
        setAvailableCart(null)
        setUserLastOrder(null)
        setNewUser(null)
        setAdmin(false)
        setIsFlipped(false)
        setButtonDisabled(true)
        const response = await fetch('https://shoppingappmalach.herokuapp.com/auth/login', { method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(values)
        })
        const data = await response.json()
        setButtonDisabled(false)
       if(data.success){
          setIsFlipped(true)
          delete data.user.password
          localStorage.setItem('user',JSON.stringify(data.user))
          if(data.user.admin) {
            setAdmin(true)
          } else {
          const availableCart = data.user.Carts.find(cart => cart.completed === false)
          if(availableCart) {
            availableCart.date = switchDate(availableCart.date)
            let sum = 0
            setAvailableCart(availableCart)
            availableCart.CartItems.forEach(item => sum += item.price)
            setAvailableCartSum(sum)
          } else if(data.ordersOfUser.length !== 0) {
            data.ordersOfUser[data.ordersOfUser.length - 1].order_date = switchDate(new Date(data.ordersOfUser[data.ordersOfUser.length - 1].order_date).toLocaleDateString())
            setUserLastOrder(data.ordersOfUser[data.ordersOfUser.length - 1])
          } else {
            setNewUser(data.user.firstname)
            localStorage.setItem('user',JSON.stringify({ ...data.user, newUser: true }))
          }
        }
       } else {
          setMessage(data.error)
          setOpenAlert(true)
          setButtonDisabled(false)
       }  
    } catch(error) {
       console.log(error)
    }
  }

  // Put the user in the app
  const getIn = async () => {
    setButtonStartDisabled(true)
    if(availableCart) {
      setIsUserAuth(true)
      localStorage.setItem('availableCart',JSON.stringify(availableCart))
      history.push('/products/5')
    } else {
      const user = JSON.parse(localStorage.getItem('user'))
      const res = await fetch('https://shoppingappmalach.herokuapp.com/cart',{ method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({ date: new Date().toLocaleDateString(), completed: false, UserId: user.id})
  })
      const { cart } = await res.json()
      localStorage.setItem('availableCart',JSON.stringify(cart))
     
      setTimeout(() => {
        setIsAuth(true)
        history.push('/products/5')
        setButtonStartDisabled(false)
        setIsFlipped(false)
      } ,100)
    }
  }

  const logout = () => {
    setIsFlipped(false)
    localStorage.removeItem('user')
    setAvailableCart(null)
    setUserLastOrder(null)
    setNewUser(null)
    setAdmin(false)
    setIsFlipped(false)
  }

  // Set format of the date
  const switchDate = (date) => {
    console.log(date);
    let dateArr = date.split('/')
    const temp = dateArr[0]
    dateArr[0] = dateArr[1]
    dateArr[1] = temp
    return dateArr.join('/')
  }

  useEffect(() => {
    getNumberOfProducts()
    getNumberOfOrders()
  }, [])

  return (
  
   <>
    { numberOfProducts && numberOfOrders ?
      <Grid container className={classes.root}>
        {/* Form grid */}
        <Grid item xs={10} md={4} component={Paper}  square className={classes.formGrid}>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className={classes.paper}>
            <img src="https://thumbs.dreamstime.com/b/vegetables-shopping-cart-trolley-grocery-logo-icon-design-vector-171090350.jpg" width="100" height="100" crop="scale" alt="cart" />
            <form className={classes.form} onSubmit={formik.handleSubmit} autoComplete="off">
                <TextField variant="outlined" margin="normal" fullWidth label="user name" name="email" {...formik.getFieldProps('username')} {...errorHelper(formik,'username')}/>
                <TextField 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                    </InputAdornment>
                    )}}  
                    variant="outlined" margin="normal" fullWidth name="password" label="Password" type={showPassword ? "text": "password"} {...formik.getFieldProps('password')} {...errorHelper(formik,'password')}/>
                    {/* Error Alert */}
                    <Collapse in={openAlert}>
                      <Alert
                        severity="error"
                        action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                        {message}
                      </Alert>
                    </Collapse>
                    <Button disabled={!buttonDisabled && formik.values.username && formik.values.password && !formik.errors.password ? false : true}
                    className="my-3" variant="contained" color="primary" type="submit" fullWidth> Log In </Button>
                    <Grid container>
                      <Grid item>
                        <Link to="/signup" variant="body2"> Don't have an account? Sign Up </Link>
                      </Grid>
                    </Grid>
                </form>
              </div>

              <div>
              <div className="second_flip_header">
              <h3> Hello { JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).firstname }</h3>
              </div>
            
              {!availableCart && !userLastOrder && !newUser && !admin && <ListItemText>Please log in to continue</ListItemText>}
                {availableCart && <ListItemText className={classes.longMessage}> <p className="loggedin_paragraph"> You have a shopping cart in process. The cart was created on {availableCart.date}, includes  {availableCart.CartItems.length} products and has a total amount of {availableCartSum.toFixed(2)} Dollar. </p></ListItemText>}
                {userLastOrder && <ListItemText className={classes.longMessage}><p className="loggedin_paragraph"> You do not have an open cart. Your previous order was placed on {userLastOrder.order_date} and cost {userLastOrder.price.toFixed(2)} Dollar. We invite you to open a new cart and start buying from us in the store</p></ListItemText>}
                {newUser && <ListItemText> <p className="loggedin_paragraph">  Welcome to your first purchase {newUser} 🎉</p></ListItemText>}
                {admin && <div className="admin_div"> <p className="admin_paragraph">  Hello mister admin </p> </div>}
                <div className="btn_div">
                <Button className="m-3" variant="contained" color="primary" onClick={getIn} disabled={buttonStartDisabled}>{availableCart ? 'Continue purchase' : userLastOrder ?  'Start new purchase' : 'Click here to start' }  </Button>
                <Button className="m-3" variant="contained" color="secondary" onClick={() => logout() }>{'Log in with another user'}  </Button>
                </div>
                <div className="second_flip_image">
                  <img src="https://wallpaperaccess.com/full/2338280.jpg" alt="" width="50%" height="300px"/>
                </div>
              </div>
              </ReactCardFlip>

          </Grid>
    
          {/* Why us grid */}
          <Grid item xs={10} md={4} component={Paper} square className={classes.formGrid}>
            <div className={classes.header}>
              <h1> Why us ? </h1>
            </div>
            <List dense={dense}>
              <ListItem>
                <ListItemAvatar> <Avatar> <MoneyOffIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary="We guarantee the cheapest prices" />
              </ListItem>
              <ListItem>
                <ListItemAvatar> <Avatar> <PaymentIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary="Security payment" />
              </ListItem>
              <ListItem>
                <ListItemAvatar> <Avatar> <HomeWorkIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary="No need to leave the house" />
              </ListItem>
              <ListItem>
                <ListItemAvatar> <Avatar> <LocalShippingIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary="Delivery arrives to the customer's home within 24 hours" />
              </ListItem>
            </List>
            <div className="cart_image">
            <img src="https://www.pngitem.com/pimgs/m/127-1271967_food-cart-indian-street-food-cart-hd-png.png" width="200px" height="200px" alt="cart"/>
            </div>
          </Grid>

          {/* Our data grid */}
          <Grid item xs={10}  md={3} component={Paper} square className={classes.formGrid}>
            <div className={classes.header}>
              <h1> Our data </h1>
            </div>
            <List dense={dense}>
              <ListItem>
                <ListItemAvatar> <Avatar> <KitchenIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary={`We have more than ${numberOfProducts} products`} />
              </ListItem>
              <div className="gallery">
                <img className="gallery_image" src='https://www.interwealthgroup.com/wp-content/uploads/2019/09/Dont-keep-all-your-eggs-in-one-basket-3.png' alt="product1" />
                <img className="gallery_image" src='https://www.cookingclassy.com/wp-content/uploads/2019/07/steak-marinade-12.jpg' alt="product1" />
                <img className="gallery_image" src='https://www.tnuva.co.il/uploads/f_6023fa62abbff_1612970594.jpg' alt="product2" />
              </div>
              <ListItem>
                <ListItemAvatar> <Avatar> <InsertInvitationIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText primary={`We have more than ${numberOfOrders} orders`} />
              </ListItem>
              {!availableCart && !userLastOrder && !newUser && !admin ?
              <ListItem>
                <ListItemAvatar> <Avatar> <VpnKeyIcon  color="action" /> </Avatar> </ListItemAvatar>
                <ListItemText> Please log in to continue </ListItemText>
              </ListItem>
              : null}
            </List>
         
         
        </Grid>
      </Grid>
              : <Loader />}
              </>
    )
}

export default SignIn
