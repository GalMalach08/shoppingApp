import React,{ useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
// Components
import Carusel from '../caursel/Carusel'
//  Images
import SignUpPhoto from '../../images/signPhoto.png'
// material ui
import { makeStyles } from '@material-ui/core/styles'
import { Grid, TextField, Button, Paper, Collapse, InputAdornment, Select, MenuItem, Hidden, Stepper, Step, StepLabel } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// formik
import { Formik } from 'formik'
import * as Yup from 'yup'
// css
import './style.css'

const useStyles = makeStyles((theme) => ({
    root: {
      marginTop:'20px'
    },
    image: {
      position:'relative',
      backgroundImage: `url(${SignUpPhoto})`,
      backgroundRepeat: 'no-repeat',
      alignSelf: 'center',
      backgroundPosition: '0 0',
      backgroundSize: '454px 618px',
      flexBasis: '454px',
      height: '618px',
    },
    formGrid: {
      margin:'70px 15px'
    },
    paper: {
      margin: theme.spacing(3, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    }
}))


const SignUp = ({ setIsAuth }) => {
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [chosenCity, setChosenCity] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const steps = ['Basic authentication details', 'Advanced authentication details']
  const cityArr = ['Ashdod', 'Beer Sheva', 'Beni Brak', 'Heifa', 'Holon', 'Netaniya', 'Petah Tikva', 'Ramat Gan', 'Rishon Lezion', 'Tel Aviv' ]
  const classes = useStyles()
  const history = useHistory()
  
  // Form validation
  const validationSchema = Yup.object().shape({
    firstname:Yup.string()
    .required('first name is required!'),
    lastname:Yup.string()
    .required('last name is required!'),
    username:Yup.string()
    .required('user name is required!')
    .email(),
    password:Yup.string()
    .required('password is required!')
    .min(6, 'password have to be at least 6 characters long'),
    confirmPassword:Yup.string()
    .required('confirm your password!')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    city:Yup.string()
    .required('city is required!'),
    street:Yup.string()
    .required('street is required!'),
    })

  const errorHelper = (formik,values) => ({
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })
 
  // Handle password visiblity 
  const  handleClickShowPassword = () => setShowPassword(!showPassword)

  // Handle confirm password visiblity 
  const handleClickConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)
  
  // Handle next stepper state
  const handleNext = () => setActiveStep((prev) => prev + 1)

  // Handle back stepper state
  const handleBack = () => setActiveStep((prev) => prev - 1)

  // Check if user excist
  const isUserExcist = async (username) => {
    const response = await fetch('https://shoppingappmalach.herokuapp.com/auth/username', { 
      method: 'POST',
      headers: {
       'Content-Type':'application/json'
     },
     body: JSON.stringify({ username })
     })
     const { success, error } = await response.json()
    if(success) {
      handleNext()
    } else {
      setMessage(error)
      setOpenAlert(true)
    }
  }

  // Sign up new user
  const signUpUser = async (values) => {
    try {
        setButtonDisabled(true)
         const response = await fetch('https://shoppingappmalach.herokuapp.com/auth/signup', { 
         method: 'POST',
         headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ ...values })
        })
        const { user, error } = await response.json()
        if(user) {
          delete user.password
          localStorage.setItem('user', JSON.stringify({...user, newUser:true }))
          const res = await fetch('https://shoppingappmalach.herokuapp.com/cart',{ method: 'POST',
          headers: {
              'Content-Type':'application/json'
          },
          body: JSON.stringify({ date: new Date().toLocaleDateString(), completed: false, UserId: user.id})
          })
          const { cart } = await res.json()
          localStorage.setItem('availableCart',JSON.stringify(cart))
          setTimeout(() => {
            setButtonDisabled(false)
            setIsAuth(true)
            history.push('/products/5')
          } ,100)
          } else {
          setMessage(error)
          setOpenAlert(true)
          setButtonDisabled(false)
          }
        } catch (error) {
            console.error(error)
          }
      }
  
    return (
      <Grid container className={classes.root}>

        {/* Carusel */}
        <Hidden mdDown>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={2} lg={4} className={classes.image} >
              <Carusel />
            </Grid>
         </Hidden>
 
      {/* Sign up form */}
      <Grid item xs={12} lg={6}  component={Paper} elevation={6} square className={classes.formGrid}>
          <div className={classes.paper}>
          <img src="https://thumbs.dreamstime.com/b/vegetables-shopping-cart-trolley-grocery-logo-icon-design-vector-171090350.jpg" width="100" height="100" crop="scale" alt="cart" />
          <Stepper activeStep={activeStep}>
            {steps.map(step => (
                <Step key={step}> <StepLabel>{step}</StepLabel></Step>
            ))}
          </Stepper>
            <Formik
              initialValues={{username:'',password:'', confirmPassword:'',  firstname:'', lastname:'', street:'', city: ''}}
              onSubmit={(values) => signUpUser(values)}
              validationSchema={validationSchema}
              enableReinitialize={true}>
              {(props) => (
                <>
                <form style={{textAlign:'center'}} onSubmit={props.handleSubmit} autoComplete="off">
                { activeStep === 0 && 
                <>
                <TextField name="username" margin="normal" label="Email" variant="outlined" fullWidth {...props.getFieldProps('username')} {...errorHelper(props,'username')}/>   
                 
               <TextField  type={showPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="password" label="Password" {...props.getFieldProps('password')} {...errorHelper(props,'password')} 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                      </InputAdornment>
                  )}} />

                <TextField type={showConfirmPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirm Password" {...props.getFieldProps('confirmPassword')} {...errorHelper(props,'confirmPassword')} 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickConfirmPassword}> {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                      </InputAdornment>
                  )}} />
                {/* Alert error */}
                <Collapse in={openAlert}>
                  <Alert
                    severity="error"
                    action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                    {message}
                  </Alert>
                </Collapse>

                <Button 
                disabled={props.values.username && !props.errors.username 
                && props.values.password &&  !props.errors.password 
                && props.values.confirmPassword &&  !props.errors.confirmPassword  ? false : true} 
                className="my-3" variant="contained" color="primary" size="large" fullWidth onClick={() => isUserExcist(props.values.username)}> Next </Button>
                </>
                }

                { activeStep === 1 && 
                <>
                  <TextField name="firstname" margin="normal" label="First name" variant="outlined" fullWidth {...props.getFieldProps('firstname')} {...errorHelper(props,'firstname')}/>
                  <TextField name="lastname" margin="normal" label="Last name" variant="outlined" fullWidth {...props.getFieldProps('lastname')} {...errorHelper(props,'lastname')}/>   
                
                  <Select value={chosenCity} onChange={(e) => setChosenCity(e.target.value)} name="city" fullWidth  {...props.getFieldProps('city')} {...errorHelper(props,'city')}>
                    {cityArr.map(city => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>

                  <TextField name="street" margin="normal" label="Street" variant="outlined" fullWidth {...props.getFieldProps('street')} {...errorHelper(props,'street')}/>   
             
                
                <Button 
                disabled={props.values.firstname && props.values.lastname 
                && props.values.city &&  props.values.street && !buttonDisabled ? false : true} 
                className="my-3" variant="contained" color="primary" size="large" fullWidth type="submit"> Sign up </Button>
                
                <Button className="my-3" variant="contained" color="primary" size="large" fullWidth onClick={handleBack}> Back </Button>
                </>
                }
             
                <Grid container>
                  <Grid item>
                    <Link to="/signin" variant="body2"> Already have an account? Sign In </Link>
                  </Grid>
                </Grid>    
              </form> 
            </>
          )}
      </Formik>  
    </div>
  </Grid> 
  <Grid item xs={2}></Grid>
</Grid>   
    )
}
export default SignUp


