export const initialState = {
    filters: {
        men: true,
        women: true,
        tshirt: true,
        sweatshirt: true
    },
    cart: [],
    products: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return {...state, filters: {...state.filters, [action.filter.key]: action.filter.value}}

        case 'ADD_TO_CART':
            return {...state, cart: [...state.cart, action.product]}

        case 'GET_PRODUCTS_SUCCESS':
            return {...state, products: action.payload}

        default:
            return state
    }
}

export default reducer
