import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setProductsState, setDrawerState, setProductToUpdate } from '../../../../store/actions'
// React toastify 
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Material ui
import { TextField, Button, Select, MenuItem, IconButton, Input, Collapse, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ImageIcon from '@material-ui/icons/Image'
import AddIcon from '@material-ui/icons/Add'
// Formik
import { Formik } from 'formik'
import * as Yup from 'yup'

const useStyles = makeStyles(() => ({
    radio_btn_label: {
      textAlign:'left',
      marginTop:'5px',
    },
    radio_group: {
      display:'flex',
      flexDirection:'row',
    },
}))

const AdminSideBar = () => {
  const [disableButton, setDisableButton] = useState(false)
  const [categoryArr, setCategoryArr] = useState([])
  const [imageName, setImageName] = useState('')
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [initialValues, setInitialValues] = useState({name:'', price: '', image: '', category: '', description: ''})
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTypeOfPrice, setSelectedTypeOfPrice] = useState('product')
  const productToUpdate = useSelector(state => state.products.productToUpdate)
  const products = useSelector(state => state.products.data)
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()

  // Form validation
  const validationSchema = Yup.object().shape({
    name:Yup.string()
    .required('name is required!')
    .max(20,'you cant write that much!'),
    description:Yup.string()
    .max(35,'you cant write that much!'),
    price:Yup.string()
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

  // Toastify
  const successToast = (message) => {
    toast(message, { 
     draggable: true, 
     position: toast.POSITION.BOTTOM_RIGHT,
     transition: Zoom,
     autoClose: 2000
    })
  }
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
  // Get all the categories 
  const getCategories = async () => {
    const res = await fetch('https://shoppingappmalach.herokuapp.com/category')
    const { categories } = await res.json()
    const categoryArr = []
    categories.forEach(category => categoryArr.push({ name: category.name, id: category.id }))
    setCategoryArr(categoryArr)
  }


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

  // Handle drawer state
  const handleDrawerClose = () => dispatch(setDrawerState(false))
  
  // Change the form from update to add
  const changeStatetoAdd = () => {
    dispatch(setProductToUpdate({}))
    setInitialValues({name:'', price: '', image: '', description: '', category: ''})
    setImageName('')
    setSelectedTypeOfPrice('product')
  }

  // Set the initial values to the update form
  useEffect(() => {
    if(productToUpdate.name) {
    const { name, description, price, image, Category, imageName, priceInKg } = productToUpdate
    setInitialValues({ name, description, price, image, category: Category.name })
    setImageName(imageName)
    setSelectedCategory(Category.name)
    setSelectedTypeOfPrice(priceInKg ? 'kg' : 'product' )
    }
  }, [productToUpdate])

  useEffect(() => {
    getCategories() 
  }, [])
  
    return (
        <div>
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
       
        </div>
    )
}

export default AdminSideBar
