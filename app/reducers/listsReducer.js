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
    let currentCardList = state.find(l => l.cards.indexOf(action.cardId) !== -1)
    let lists = state.map(l => { return {...l, cards: l.cards.filter(c => c !== action.cardId) }; });
    let currentCardIdx = currentCardList ? _(currentCardList.cards).findIndex(cardId => cardId == action.cardId) : -1

    let effectiveLocationIdx = (currentCardList &&
                               currentCardList.name == action.listName &&
                               action.dropLocationIdx > currentCardIdx) ?
                               action.dropLocationIdx - 1 : 
                               action.dropLocationIdx

    let [list, otherLists] = _(lists).partition(l => l.name == action.listName).value()
    list = list[0]

    let [cardsBefore, cardsAfter] = _(list.cards).map((cardId, idx) => {return {cardId, idx}})
                                          .partition(c => c.idx < effectiveLocationIdx)
                                          .map(partition => partition.map(c => c.cardId)).value()

    let newCardsArray = [ ...cardsBefore, action.cardId, ...cardsAfter ]

    let newList = { ...list, cards: newCardsArray };

    let newSet = [newList, ...otherLists];

    //Retain the original order
    let newState = lists.map(l => newSet.find(l2 => l2.name == l.name)); 

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
