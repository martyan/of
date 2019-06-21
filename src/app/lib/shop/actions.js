import { db } from '../firebase'

export const addToCart = (product) => ({ type: 'ADD_TO_CART', product })

export const setFilter = (key, value) => ({ type: 'SET_FILTER', filter: {key, value} })

export const setDefaultFilters = () => (dispatch) => {
    dispatch(setFilter('men', true))
    dispatch(setFilter('women', true))
    dispatch(setFilter('tshirt', true))
    dispatch(setFilter('sweatshirt', true))
}

export const createProduct = (product) => ({
    type: 'CREATE_PRODUCT',
    payload: db.collection('products').add(product)
})

export const getProducts = () => ({
    type: 'GET_PRODUCTS',
    payload: db.collection('products')/*.orderBy('createdAt', 'desc')*/.get()
})