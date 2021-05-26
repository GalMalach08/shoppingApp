
export default function usersReducer(state={ isAdmin: false },action) {
    switch(action.type){
        case 'SET_IS_ADMIN':
            return {...state, isAdmin: action.payload }
        default:
            return state;
    }
}