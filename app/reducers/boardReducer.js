import _ from 'lodash'
import cards from '../cardsData'
import BaseReducer from './baseReducer'

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
        'MOVE_CARD': 'reduceMoveCard',
        'CHANGE_BACKGROUND': 'reduceChangeBackground'
      }
    })

    this.initialState = initialState
  }

  reduceMoveCard(state, action) {
    let card = _(state.lists).map(l => l.cards).flatten().find({ id: action.cardId }); 

    let list = state.lists.find(l => l.name == action.listName);

    let otherLists = state.lists.filter(l => l.name !== action.listName)
                                .map(l => { return {...l, cards: l.cards.filter(c => c.id !== action.cardId) }; });

    var newList = { ...list, cards: list.cards.concat(card) };

    let newSet = [newList, ...otherLists];

    //Retain the original order
    let newState = {...state, lists: state.lists.map(l => newSet.find(l2 => l2.name == l.name))}; 

    return newState;
  }

  reduceChangeBackground(state, action) {
    return state
  }

}
