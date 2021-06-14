import React from 'react'
import { useHistory } from 'react-router-dom'
// Material ui
import { Button } from '@material-ui/core'
// Bootstrap
import Modal from 'react-bootstrap/Modal'



const RegisterModal = ({ registerModalOpen, setRegisterModalOpen, firstname }) => {
  const history = useHistory()

  const setModalHide = () => {
    setRegisterModalOpen(false)
    history.push('/login')
  }

   
  return (
    <>
        <Modal size="md" centered show={registerModalOpen} onHide={() => setModalHide()} style={{margin:'70px auto 30px', textAlign:'center'}}>
            <Modal.Header style={{textAlign:'center', margin:'auto'}}>
                <Modal.Title style={{fontWeight:'700'}}> 
                <p>Thank you {firstname}!</p>
                <h5>The registration was successful</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button  className="my-3" variant="contained" color="primary" size="large" onClick={() => history.push('/login')}> Click here to go to the login screen </Button>
            </Modal.Body>
        </Modal>
    </>
    )
}

export default RegisterModal
