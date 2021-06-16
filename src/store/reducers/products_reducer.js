export default function productsReducer(state={data:[], cartProducts: [],productToUpdate: {}, totalPrice:0, noProducts: false },action) {
    switch(action.type){
        case 'SET_PRODUCTS':
            return {...state, data:[...action.payload]}
        case 'SET_CART_PRODUCTS':
            return {...state, cartProducts:[...action.payload]}
        case 'SET_ALL_PRODUCTS':
            return {...state, allProducts:[...action.payload]}
        case 'ADD_CART_PRODUCTS':
            return {...state, cartProducts:[...state.cartProducts, action.payload]}
        case 'UPDATE_TOTAL_PRICE':
            return {...state,totalPrice: Number((state.totalPrice + action.payload).toFixed(2))}
        case 'RESET_TOTAL_PRICE':
            return {...state,totalPrice: 0}
        case 'SET_PRODUCT_TO_UPDATE':
            return {...state,productToUpdate: action.payload}
        case 'SET_NO_PRODUTS':
            return {...state,noProducts: action.payload}
            
        default:
            return state;
    }
}
