import React,{ useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
// Components
import Carusel from '../caursel/Carusel'
import RegisterModal from './registrationModal/RegistrationModal'
//  Images
import SignUpPhoto from '../../images/signPhoto.png'
// material ui
import { makeStyles } from '@material-ui/core/styles'
import { Grid, TextField, Button, Paper, Collapse, InputAdornment, InputLabel, FormControl, Select, MenuItem, Hidden, Stepper, Step, StepLabel } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// formik
import { Formik } from 'formik'
import * as Yup from 'yup'
import zxcvbn from "zxcvbn"
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
    select: {
      width:'100%',
      margin:'10px 0px'
    },
    selectLabel: {
      fontSize:'20px',
      marginLeft:'3px',
      marginTop:'-5px'
      
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    }
}))


const SignUp = ({ setIsAuth }) => {
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [firstname, setFirstName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [chosenCity, setChosenCity] = useState('Choose city')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [score, setScore] = useState(0)
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
    .required('email is required!')
    .email('must be valid email!'),
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
    setNextDisabled(true)
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
    setNextDisabled(false)
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
          setFirstName(user.firstname)
          setRegisterModalOpen(true)
          } else {
          setMessage(error)
          setOpenAlert(true)
          }
          setButtonDisabled(false)
        } catch (error) {
            console.error(error)
          }
  }

  // Password strengh functions
  const passwordColor = () => {
    switch (score) {
      case 0:  return  '#828282'
      case 25: return  '#ea1111'
      case 50: return "#ffad00"
      case 75: return "lightGreen"
      case 100: return "#00b500"
      default: return "none"
    }
  }

  const createPasswordLabel = () => {
    switch (score) {
    case 25: return  'Very Weak'
    case 50: return "Weak"
    case 75: return "Good"
    case 100: return "Strong"
    default: return ""
  }
}

  const checkPasswordStrength = (password) => {
    const testResult = zxcvbn(password)
    console.log(testResult);
    const score = testResult.score * 100/4
    setScore(score)
  }

  const changePasswordColor =  {
    width:`${score}%`,
    backgroundColor:`${passwordColor()}`,
    height:'7px'
  }

    return (
      <Grid container className={classes.root}>

        {/* Carusel */}
        <Hidden mdDown>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={2} lg={4} className={classes.image}>
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
                 
               <TextField  type={showPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="password" label="Password" onKeyUp={e => checkPasswordStrength(e.target.value)} {...props.getFieldProps('password')} {...errorHelper(props,'password')} 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                      </InputAdornment>
                  )}} />
                  <div className="progress">
                    <div className="progress-bar" style={changePasswordColor}></div>
                  </div>
                  <p style={{ color: passwordColor(), textAlign:'left', margin:'2px'}}>{createPasswordLabel()}</p>

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
                && props.values.confirmPassword &&  !props.errors.confirmPassword && !nextDisabled ? false : true} 
                className="my-3" variant="contained" color="primary" size="large" fullWidth onClick={() => isUserExcist(props.values.username)}> Next </Button>
                </>
                }

                { activeStep === 1 && 
                <>
                  <TextField name="firstname" margin="normal" label="First name" variant="outlined" fullWidth {...props.getFieldProps('firstname')} {...errorHelper(props,'firstname')}/>
                  <TextField name="lastname" margin="normal" label="Last name" variant="outlined" fullWidth {...props.getFieldProps('lastname')} {...errorHelper(props,'lastname')}/>   
                  <FormControl className={classes.select} style={{width:'100%'}}>
                    <InputLabel className={classes.selectLabel}>City</InputLabel>
                    <Select fullWidth value={chosenCity} onChange={(e) => setChosenCity(e.target.value)} name="city"  {...props.getFieldProps('city')} {...errorHelper(props,'city')}>
                      {cityArr.map(city => (
                        <MenuItem key={city} value={city}>{city}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
  {registerModalOpen && <RegisterModal firstname={firstname} registerModalOpen={registerModalOpen} setRegisterModalOpen={setRegisterModalOpen}/>}
</Grid>   
    )
}
export default SignUp


