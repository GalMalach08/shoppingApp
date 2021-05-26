export const setProductsState = (products) => ({ 
    type:'SET_PRODUCTS',
    payload:products
})

export const setAllProductsState = (products) => ({ 
    type:'SET_ALL_PRODUCTS',
    payload:products
})


export const setCartProducts = (products) => ({ 
    type:'SET_CART_PRODUCTS',
    payload:products
})


export const addCartProducts = (product) => ({ 
    type:'ADD_CART_PRODUCTS',
    payload:product
})

export const updateTotalPrice = (price) => ({ 
    type:'UPDATE_TOTAL_PRICE',
    payload:price
})

export const resetTotalPrice = () => ({ 
    type:'RESET_TOTAL_PRICE',
    payload:0
})

export const setIsAdmin = (isAdmin) => ({ 
    type:'SET_IS_ADMIN',
    payload: isAdmin
})

export const setProductToUpdate = (product) => ({ 
    type:'SET_PRODUCT_TO_UPDATE',
    payload: product
})

export const setNoProducts = (bool) => ({ 
    type:'SET_NO_PRODUTS',
    payload: bool
})

export const setDrawerState = (isOpen) => ({ 
    type:'SET_DRAWER_STATE',
    payload: isOpen
})



