export const initialState = {
    filters: {
        men: true,
        women: true,
        tshirt: true,
        sweatshirt: true,
        skateboard: true
    },
    cart: [],
    products: [],
    product: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return {...state, filters: {...state.filters, [action.filter.key]: action.filter.value}}

        case 'ADD_TO_CART':
            return {...state, cart: [...state.cart, action.product]}

        case 'GET_PRODUCTS_SUCCESS':
            return {...state, products: action.payload}

        case 'GET_PRODUCT_REQUEST':
            return {...state, product: null}
        case 'GET_PRODUCT_SUCCESS':
            return {...state, product: action.payload}

        default:
            return state
    }
}

export default reducer
