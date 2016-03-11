import _ from 'lodash'
import cards from '../cardsData'

let initialState = {
      lists: [
        {name: "Backlog", color: '#CFCBF5', cards},
        {name: "In Progress", color: '#D1F5CB', cards: []},
        {name: "Done", color: '#F5F4CB', cards: []}
      ]
    };

export default (state = initialState, action) => {
      switch (action.type) {
        case 'MOVE_CARD':
          let card = _(state.lists).map(l => l.cards).flatten().find({ id: action.cardId }); 
          let list = state.lists.find(l => l.name == action.listName);

          let otherLists = state.lists.filter(l => l.name !== action.listName)
                                      .map(l => { return {...l, cards: l.cards.filter(c => c.id !== action.cardId) }; });

          var newList = { ...list, cards: list.cards.concat(card) };

          let newSet = [newList, ...otherLists];
          let newState = {lists: state.lists.map(l => newSet.find(l2 => l2.name == l.name))}; 

          return newState;
        default:
          return state;
      }
    }
