import React from 'react'
// Bootstrap
import Carousel from 'react-bootstrap/Carousel'
// Material ui
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    slider: {
      width:'54%',
      margin: '99px 0 0 151px',
      position: 'relative',
      left:'-3px',
      bottom: '3px'
    }
}))

const Carusel = () => {
 const classes = useStyles()
    return (
    <Carousel fade className={classes.slider} interval={2000}>
      <Carousel.Item>
        <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1906&q=80" height="435" width="245" crop="scale" alt="slider1"/>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" height="435" width="245" crop="scale"  alt="slider2" />
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" height="435" width="245" crop="scale"  alt="slider3" />
      </Carousel.Item>
    </Carousel>
    )
}

export default Carusel
