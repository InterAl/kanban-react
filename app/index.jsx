import React from 'react'
import ReactDOM from 'react-dom'
import Board from './board.jsx'
import rootReducer from './reducers/infra/rootReducer'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

let store = createStore(rootReducer)

console.log("store", store)

ReactDOM.render(<Provider store={store}>
                  <Board />
                </Provider>,
                document.getElementById('root'));
