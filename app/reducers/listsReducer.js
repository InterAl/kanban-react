import _ from 'lodash'
import BaseReducer from './infra/baseReducer'
import immutableUtils from '../utils/immutableUtils'

let initialState = [
        {name: "Backlog", color: '#CFCBF5', cards:[1, 2, 3]},
        {name: "In Progress", color: '#D1F5CB', cards: []},
        {name: "Done", color: '#F5F4CB', cards: []}
      ];

export default class ListsReducer extends BaseReducer {
  constructor() {
    
    super({
        slice: 'board.lists',
        actions: {
          "MOVE_CARD": "reduceMoveCard",
          "REMOVE_CARD": "reduceRemoveCard"
        }
    })

    this.initialState = initialState
  } 

  reduceMoveCard(state, action) {
    let list = state.find(l => l.name == action.listName);

    let otherLists = state.filter(l => l.name !== action.listName)
                                .map(l => { return {...l, cards: l.cards.filter(c => c !== action.cardId) }; });

    var newList = { ...list, cards: list.cards.concat(action.cardId) };

    let newSet = [newList, ...otherLists];

    //Retain the original order
    let newState = state.map(l => newSet.find(l2 => l2.name == l.name)); 

    return newState;
  } 

  reduceRemoveCard(state, action) {
    let next = immutableUtils.updateCollectionItem(state,
                                                   l => l.cards.indexOf(action.cardId) !== -1,
                                                   list => { return { ...list, cards: list.cards.filter(c => c !== action.cardId )}})
    let nextOrdered = state.map(l => next.find(l2 => l2.name == l.name))
    return nextOrdered
  }
}
