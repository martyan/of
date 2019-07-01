import { db } from '../firebase'
import { CALL_API } from '../apiMiddleware'

export const removeLastProductInCart = (product, cart) => {
    const index = cart.slice().reverse().findIndex(item => item.id === product.id && item.size === product.size)
    const lastIndex = index >= 0 ? cart.length - 1 - index : index

    return cart.filter((item, i) => i !== lastIndex)
}

export const setCart = (cart) => ({ type: 'SET_CART', cart })

export const addToCart = (product) => (dispatch, getState) => {
    try {
        const { cart } = getState().shop
        localStorage.setItem('cart', JSON.stringify([...cart, product]))
    } catch(error) {}

    dispatch({ type: 'ADD_TO_CART', product })
}

export const removeFromCart = (product) => (dispatch, getState) => {
    try {
        const { cart } = getState().shop
        const updatedCart = removeLastProductInCart(product, cart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    } catch(error) { console.log(error)}

    dispatch({ type: 'REMOVE_FROM_CART', product })
}

export const setFilter = (key, value) => ({ type: 'SET_FILTER', filter: {key, value} })

export const setDefaultFilters = () => (dispatch) => {
    dispatch(setFilter('men', true))
    dispatch(setFilter('women', true))
    dispatch(setFilter('tshirt', true))
    dispatch(setFilter('sweatshirt', true))
    dispatch(setFilter('skateboard', true))
}

export const createProduct = (product) => ({
    type: 'CREATE_PRODUCT',
    payload: db.collection('products').add(product)
})

export const getProduct = (productId) => ({
    type: 'GET_PRODUCT',
    payload: db.collection('products').doc(productId).get()
})

export const updateProduct = (productId, product) => ({
    type: 'UPDATE_PRODUCT',
    payload: db.collection('products').doc(productId).update(product)
})

export const deleteProduct = (productId) => ({
    type: 'DELETE_PRODUCT',
    payload: db.collection('products').doc(productId).delete()
})

export const getProducts = () => ({
    type: 'GET_PRODUCTS',
    payload: db.collection('products').orderBy('createdAt', 'desc').get()
})

export const getConfig = (configId) => ({
    type: 'GET_CONFIG',
    payload: db.collection('configs').doc(configId).get()
})

export const updateConfig = (configId, config) => ({
    type: 'UPDATE_CONFIG',
    payload: db.collection('configs').doc(configId).set(config)
})

export const createPayment = (data) => ({
    [CALL_API]: {
        type: 'CREATE_PAYMENT',
        endpoint: `/payment`,
        method: 'POST',
        data
    }
})
