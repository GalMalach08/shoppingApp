import React ,{ useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { resetTotalPrice, setProductToUpdate, setProductsState, setDrawerState, setCartProducts } from '../../store/actions'

const LogOut = ({ setIsAuth }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const logOut = async () => {
    setIsAuth(false)
    dispatch(resetTotalPrice())
    dispatch(setProductToUpdate({}))
    dispatch(setProductsState([]))
    dispatch(setCartProducts([]))
    dispatch(setDrawerState(false))
    localStorage.removeItem('user')
    localStorage.removeItem('availableCart')
    history.push('/signin') 
}
    
  useEffect(() => {
    logOut()
}, [])

    return null   
}

export default LogOut
