import { getLastIndexInCart, removeLastProductInCart } from './actions'

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
    product: null,
    configs: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return {...state, filters: {...state.filters, [action.filter.key]: action.filter.value}}

        case 'SET_CART':
            return {...state, cart: action.cart}

        case 'ADD_TO_CART':
            return {...state, cart: [...state.cart, action.product]}

        case 'REMOVE_FROM_CART':
            const updatedCart = removeLastProductInCart(action.product, state.cart)
            return {...state, cart: updatedCart}

        case 'GET_PRODUCTS_SUCCESS':
            return {...state, products: action.payload}

        case 'GET_PRODUCT_REQUEST':
            return {...state, product: null}
        case 'GET_PRODUCT_SUCCESS':
            return {...state, product: action.payload}

        case 'GET_CONFIG_SUCCESS':
            return {...state, configs: {...state.configs, [action.payload.name]: action.payload[action.payload.name]}}

        default:
            return state
    }
}

export default reducer
