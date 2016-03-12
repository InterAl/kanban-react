import _ from 'lodash'
import cards from '../cardsData'
import BaseReducer from './infra/baseReducer'

let initialState = [
        {name: "Backlog", color: '#CFCBF5', cards},
        {name: "In Progress", color: '#D1F5CB', cards: []},
        {name: "Done", color: '#F5F4CB', cards: []}
      ];

export default class ListsReducer extends BaseReducer {
  constructor() {
    
    super({
        slice: 'board.lists',
        actions: {
          "MOVE_CARD": "reduceMoveCard"
        }
    })

    this.initialState = initialState
  } 

  reduceMoveCard(state, action) {
    let card = _(state).map(l => l.cards).flatten().find({ id: action.cardId }); 

    let list = state.find(l => l.name == action.listName);

    let otherLists = state.filter(l => l.name !== action.listName)
                                .map(l => { return {...l, cards: l.cards.filter(c => c.id !== action.cardId) }; });

    var newList = { ...list, cards: list.cards.concat(card) };

    let newSet = [newList, ...otherLists];

    //Retain the original order
    let newState = state.map(l => newSet.find(l2 => l2.name == l.name)); 

    return newState;
  } 
}
