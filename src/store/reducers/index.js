import { combineReducers } from 'redux';
import products from './products_reducer';
import users from './users_reducer'
import drawer from './drawer_reducer'

const appReducers = combineReducers({
    users,
    products,
    drawer
})
export default appReducers; // this goes to the index of the store and helps build the store