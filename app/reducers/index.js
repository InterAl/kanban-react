import {combineReducers} from 'redux'
import board from './boardReducer'

console.log("board reducer:", board)
export default combineReducers({
  board
});
