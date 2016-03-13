import _ from 'lodash'
import cards from '../cardsData'
import BaseReducer from './infra/baseReducer'

let initialState = { };

export default class BoardReducer extends BaseReducer {
  constructor() {
    //super('board', 'MOVE_CARD', 'CHANGE_BACKGROUND')
    
    super({
      slice: 'board',
      actions: {
        'CHANGE_BACKGROUND': 'reduceChangeBackground'
      }
    })

    this.initialState = initialState
  }


  reduceChangeBackground(state, action) {
    return state
  }

}
