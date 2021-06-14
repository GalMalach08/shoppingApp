import React from 'react'
import { useHistory } from 'react-router-dom'
// Redux
import { useSelector } from 'react-redux'
// Material ui
import { Button } from '@material-ui/core'
// Bootstrap
import Modal from 'react-bootstrap/Modal'
// Css 
import './style.css'


const PaymentModal = ({ modalOpen, setModalOpen, orderId }) => {
  const products = useSelector(state => state.products)
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem('user'))  

  const setModalHide = () => {
    setModalOpen(false)
    history.push('logout')
  }
  // Make the receipt
  const downloadTxtFile = () => {
    const fileArr = ['Your receipt:']
    const element = document.createElement("a")
    products.cartProducts.forEach((product,i) => fileArr.push(`${i+1}. ${product.amount} ${product.name} cost $${product.totalPrice}`))
    fileArr.push(`your order's total price is: $${products.totalPrice} `)
    const file = new Blob([fileArr.join('\n')], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = "myFile.txt"
    element.click()
  }
   
  return (
    <>
        <Modal size="md" centered show={modalOpen} onHide={() => setModalHide()} style={{margin:'70px auto 30px', textAlign:'center'}}>
            <Modal.Header>
                <Modal.Title style={{fontWeight:'700'}}> 
                <p>Thank you {user.firstname}!</p>
                <h5>Your order has been successfully placed! The order number is {orderId}</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>To download a receipt <span className="recipe_download_btn" onClick={downloadTxtFile}> click here </span></p>
                <Button  className="my-3" variant="contained" color="primary" size="large" onClick={() => history.push('logout')}> Finish order </Button>
            </Modal.Body>
        </Modal>
    </>
    )
}

export default PaymentModal
