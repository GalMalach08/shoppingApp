import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import { Provider } from 'react-redux';
import ReduxStore from './store/index'

ReactDOM.render(

   <Provider store={ReduxStore()}>
    <Routes />
    </Provider>
    ,document.getElementById('root')
);

