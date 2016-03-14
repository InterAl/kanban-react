import appRootReducer from '../reducers/appRootReducer'
import {createStore, compose} from 'redux'

let store = createStore(appRootReducer, window.devToolsExtension ? window.devToolsExtension() : undefined)
export default store 
