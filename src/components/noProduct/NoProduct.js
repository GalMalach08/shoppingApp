import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron } from 'react-bootstrap'
import './style.css'
const NoProduct = () => {
    return (
        <Jumbotron className="not_found_div">
        <h1>Were sorry!</h1>
        <p>
        But there are no results matching your search... Please search again or return to <Link className="home_page_link" to="/products/5"> home page</Link>
        </p>
      
      </Jumbotron>
    )
}

export default NoProduct
