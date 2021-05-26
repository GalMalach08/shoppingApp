import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Redux
import { useSelector } from 'react-redux'
// Components
import PaymentModal from './PaymentModal'
// Material ui
import { Grid, TextField, Button, Paper, Collapse, IconButton, Table, TableBody, TableCell,
TableContainer, TableHead, TableRow } from '@material-ui/core'
import SearchBar from "material-ui-search-bar"
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'
// Dates
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
// Formik
import { useFormik } from 'formik'
import * as Yup from 'yup'
// Cloudinary
import { Image } from 'cloudinary-react'

  
const useStyles = makeStyles((theme) => ({
    root: {
     padding:'0px'
    },
    formGrid: {
      margin:'20px 40px '
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
    }
}))


const Payment = () => {
  const [modalOpen, setModalOpen] = useState(false)  
  const [orderId, setOrderId] = useState(1)  
  const [message, setMessage] = useState('')
  const [shipmentDatesArr, setShipmentDatesArr] = useState([])
  const [openAlert, setOpenAlert] = useState(false)
  const [searched, setSearched] = useState("")
  const [rows, setRows] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const cartItems = useSelector(state => state.products.cartProducts)
  const totalPrice = useSelector(state => state.products.totalPrice)
  const user = JSON.parse(localStorage.getItem('user'))
  const cart = JSON.parse(localStorage.getItem('availableCart'))
  const classes = useStyles()

  // Formik
  const formik = useFormik({
    initialValues:{street: ' ', city: '', creditNumber: ''},
    validationSchema:Yup.object({
        city:Yup.string()
        .required('city is required'),
        street:Yup.string()
        .required('street is required'),
        creditNumber:Yup.string()
        .required('credit card is required')
        // .matches(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,'please enter valid credit card')
    }),
    onSubmit:(values,{resetForm}) => {                              
      makeOrder(values)
    }
  })

  const errorHelper = (formik,values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })

  // Make an order
  const makeOrder = async (values) => {
    const orderObj = {
      ...values,
      price: totalPrice,
      order_date:new Date(),
      shipment_date: selectedDate,
      CartId: cart.id,
      UserId: user.id
      }
      const response = await fetch('https://shoppingappmalach.herokuapp.com/order', { method: 'POST',
          headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(orderObj)
        })
        const { order } = await response.json()
        setOrderId(order.id)
        setModalOpen(true)
  }
 
  // Get all the cart products and set them in the table
  const getProducts =   () => {
    const itemsArr = []
    cartItems.forEach(item => {
      itemsArr.push(item)
    })
    setRows(itemsArr)
  }

  // Make the search in the table
  const requestSearch = (searchedVal) => {
    if(searchedVal === '') {
        getProducts()
    } else {
        const filteredRows = cartItems.filter((row) => row.name.toLowerCase().includes(searchedVal.toLowerCase()))
        setRows(filteredRows)
      }
  }

  // Set the default values 
  const getInputValue = (inputName) => {
   formik.setFieldValue(inputName,user[inputName])
  }

  // Handle the date state
  const handleDateChange = (date) => setSelectedDate(date)

  // Disable specific dates in the date picker
  const disableDates = (date) => {
    const datesArr =  shipmentDatesArr.filter(item => item.month === date.getMonth() && item.day === date.getDate())
    return datesArr.length > 2
  }

  // Get all the orders
  const getOrders = async () => {
    const res = await fetch('https://shoppingappmalach.herokuapp.com//order')
    const { orders } = await res.json() 
    const shipmentDatesArr = []
    orders.forEach(order => shipmentDatesArr.push({ month: new Date(order.shipment_date).getMonth(), day: new Date(order.shipment_date).getDate() }))
    console.log(shipmentDatesArr)
    setShipmentDatesArr(shipmentDatesArr)
  }

  // Reset the table
  const cancelSearch = () => {
    getProducts()
  }

  useEffect(() => {
    getProducts()
    getOrders()
  }, [])
  

  return (
   
    <Grid container className={classes.root}>
        {/* Products Table */}
        <Grid item xs={12} sm={5}  component={Paper} square className={classes.formGrid}>
          <TableContainer component={Paper}>
            <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
            />
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>quantity</TableCell>
                <TableCell>total price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                <Image className="product_img"  cloudName="malachcloud" src={row.image} width="70" height="40" crop="scale" />
                  {row.name}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>${row.totalPrice}</TableCell>
              </TableRow>
            ))}
            <TableRow>
                <TableCell>
                  <p className="total_price_p">Total price: ${totalPrice}</p>
                </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Link to='/products/1' style={{textDecoration: 'none'}}>
        <Button variant="outlined" color="primary" className="m-3"> Continue shopping </Button>
      </Link>
    </Grid>
   
   {/* Order form */}
    <Grid item xs={12} sm={5} component={Paper}  square className={classes.formGrid}>
      <div className={classes.paper}>
        <img src="https://thumbs.dreamstime.com/b/vegetables-shopping-cart-trolley-grocery-logo-icon-design-vector-171090350.jpg" width="100" height="100" crop="scale" alt="cart" />
        <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
          <TextField variant="outlined" margin="normal" fullWidth label="city" name="city" {...formik.getFieldProps('city')}
             {...errorHelper(formik,'city')} onDoubleClick={() => getInputValue('city')}  helperText="Double click on the field to get the defualts values"/>
          <TextField variant="outlined" margin="normal" fullWidth label="street" name="street" {...formik.getFieldProps('street')}
             {...errorHelper(formik,'street')} onDoubleClick={() => getInputValue('street')} helperText="Double click on the field to get the defualts values"/>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
              disablePast 
              label="order date"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={disableDates}
              helperText="Dates that exceed the maximum order quantity will be marked in gray and you will not be able to select them"
              />
          </MuiPickersUtilsProvider>
        
          <TextField variant="outlined" margin="normal" fullWidth label="credit card" name="creditNumber"  
          {...formik.getFieldProps('creditNumber')} {...errorHelper(formik,'creditNumber')}/>

          {/* Error Alert */}
          <Collapse in={openAlert}>
            <Alert
              severity="error"
              action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
              {message}
            </Alert>
          </Collapse>
          <Button disabled={formik.values.city && formik.values.street && formik.values.creditNumber && ! formik.errors.creditNumber  ? false : true}  
           className="my-3" variant="contained" color="primary" type="submit" fullWidth> Send order </Button>  
        </form>
      </div>
    </Grid>
    <PaymentModal modalOpen={modalOpen} setModalOpen={setModalOpen} orderId={orderId} />
  </Grid>
  )
}
export default Payment
