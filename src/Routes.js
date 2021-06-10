import React, { useState } from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { authGaurd } from './hoc/Auth'
import Home from './components/home/Home'
import LogOut from './components/logout/LogOut'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/signup/SignUp'
import Payment from './components/payment/Payment'

import NavBar from './components/navBar/NavBar'

const Router = () => {
    const [isAuth, setIsAuth] = useState(false)

    return (
        <> 
            <BrowserRouter>
                {isAuth && <NavBar/> }
                <Switch>
                    <Route path='/signin' render={() => <SignIn  setIsAuth={setIsAuth}/> } />
                    <Route path='/signup' render={() => <SignUp  setIsAuth={setIsAuth}/> } />
                    <Route path='/logout' render={() => <LogOut setIsAuth={setIsAuth} /> } />  
                    <Route path='/payment'  component={authGaurd(Payment, setIsAuth)} /> 
                    <Route path='/products/:id' component={authGaurd(Home, setIsAuth)}/>
                    <Redirect from='*' to='/products/5' />
                </Switch>
            </BrowserRouter>
        </>   
    )
}

export default Router