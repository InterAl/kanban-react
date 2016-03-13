import React from 'react'
import ReactDOM from 'react-dom'
import Board from './board.jsx'
import appRootReducer from './reducers/appRootReducer'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

window.onload = () => {
  let store = createStore(appRootReducer)

  console.log("store", store)

  ReactDOM.render(<Provider store={store}>
                    <Board />
                  </Provider>,
                  document.getElementById('root'));
}
