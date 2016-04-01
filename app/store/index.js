import appRootReducer from '../reducers/appRootReducer'
import {createStore, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

let store = createStore(appRootReducer,
                        null,
                        applyMiddleware(thunk))
                        // compose(
                        //   applyMiddleware(thunk),
                        //   window.devToolsExtension ? window.devToolsExtension() : undefined
                        // ))
export default store 
