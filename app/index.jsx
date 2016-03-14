import React from 'react'
import ReactDOM from 'react-dom'
import Board from './board.jsx'
import store from './store'
import {Provider} from 'react-redux'

window.onload = () => {
  ReactDOM.render(<Provider store={store}>
                    <Board />
                  </Provider>,
                  document.getElementById('root'));
}
