import { combineReducers } from 'redux'
import auth, { initialState as initialStateAuth } from './auth/reducer'
import todo, { initialState as initialStateTodo } from './todo/reducer'
import shop, { initialState as initialStateShop } from './shop/reducer'

export const initialState = {
    ...initialStateAuth,
    ...initialStateTodo,
    ...initialStateShop
}

export default combineReducers({
    auth,
    todo,
    shop
})
