import _ from 'lodash'
import cards from '../cardsData'
import BaseReducer from './infra/baseReducer'

let initialState = {
      lists: [
        {name: "Backlog", color: '#CFCBF5', cards},
        {name: "In Progress", color: '#D1F5CB', cards: []},
        {name: "Done", color: '#F5F4CB', cards: []}
      ]
    };

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
