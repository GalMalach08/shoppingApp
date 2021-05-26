import React, { useState, useEffect } from 'react' // imrse
import { useHistory } from "react-router-dom"
        
export const authGaurd = (ComposedComponent, setIsAuthenticate) => {
    const AuthenticationCheck = (props) => {
        const history = useHistory()
        const [isAuth, setIsAuth] = useState(false)

        const isUserAuthenticate = async () => {
          const user = JSON.parse(localStorage.getItem('user'))
          if (user) {
            setIsAuthenticate(true)
            setIsAuth(true)
          }
          else {
            setIsAuthenticate(false)
            setIsAuth(false)
            console.log('not auth')
            history.push('/signin')
          } 
        }     
        useEffect(() => {
           isUserAuthenticate()
        }, [])
        
          return(
            <>
            { isAuth ?
             <ComposedComponent {...props} /> 
            : null}
            </>
            )
        }
    return AuthenticationCheck
}
    



        