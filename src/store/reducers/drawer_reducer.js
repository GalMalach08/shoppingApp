export default function drawerReducer(state={ isOpen: false }, action) {
    switch(action.type){
        case 'SET_DRAWER_STATE':
            return { ...state, isOpen: action.payload }
        default:
            return state;
    }
}
