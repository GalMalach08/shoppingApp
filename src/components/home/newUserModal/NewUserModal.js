import React, { useState } from 'react'
// Bootstrap
import { Modal } from 'react-bootstrap'
// Material ui
import { Button } from '@material-ui/core'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
// Css
import './style.css'

const NewUserModal = ({ setStepsEnabled })  =>  {
    const user = JSON.parse(localStorage.getItem('user'))
    const [show, setShow] = useState(true)

    // Close the modal
    const handleClose = () => setShow(false)
 
    // Start the introduction
    const hanleIntro = () => {
      handleClose() 
      toggleSteps()
    }
  
    const toggleSteps = () => {
      setStepsEnabled(true)
    }

    return (
      <>
        <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title className="modal_title"><div className="modal_title_content"> Hello {user.firstname} </div> </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Welcome to the shoppingApp! the most popular shopping website in the world with more than 100 million users!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="primary" onClick={() => hanleIntro() } style={{margin:'auto'}}>
              Let's get started! <DoneOutlineIcon style={{margin:'10px 10px 12'}}/>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
export default NewUserModal