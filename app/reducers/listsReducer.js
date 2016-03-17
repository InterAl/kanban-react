import _ from 'lodash'
import BaseReducer from './infra/baseReducer'
import immutableUtils from '../utils/immutableUtils'

let initialState = [
        {id: 1, name: "Backlog", color: '#CFCBF5', cards:[1, 2, 3]},
        {id: 2, name: "In Progress", color: '#D1F5CB', cards: []},
        {id: 3, name: "Done", color: '#F5F4CB', cards: []}
      ];

export default class ListsReducer extends BaseReducer {
  constructor() {
    super({
        slice: 'board.lists',
        actions: {
          "MOVE_CARD": "reduceMoveCard",
          "REMOVE_CARD": "reduceRemoveCard",
          "CHANGE_LIST_NAME": "reduceChangeName",
          "ADD_LIST": "reduceAddList"
        }
    })

    this.initialState = initialState
  }

  retainListsOrder(originalState, nextState) {
    return originalState.map(l => nextState.find(l2 => l2.id == l.id));
  }

  reduceMoveCard(state, action) {
    let currentCardList = state.find(l => l.cards.indexOf(action.cardId) !== -1)

    let lists = state.map(l => ({...l,
                                cards: l.cards.filter(c => c !== action.cardId)}));

    let currentCardIdx = currentCardList ?
      _(currentCardList.cards).findIndex(cardId => cardId == action.cardId) : -1

    let effectiveLocationIdx = (currentCardList &&
                               currentCardList.id == action.listId &&
                               action.dropLocationIdx > currentCardIdx) ?
                               action.dropLocationIdx - 1 :
                               action.dropLocationIdx

    let [list, otherLists] = _(lists).partition(l => l.id == action.listId)
                                     .value()
    list = list[0]

    let [cardsBefore, cardsAfter] = _(list.cards)
                                    .map((cardId, idx) => ({cardId, idx}))
                                    .partition(c => c.idx < effectiveLocationIdx)
                                    .map(partition => partition.map(c => c.cardId))
                                    .value()

    let newCardsArray = [ ...cardsBefore, action.cardId, ...cardsAfter ]
    let newList = { ...list, cards: newCardsArray };
    let newSet = [newList, ...otherLists];

    let next = this.retainListsOrder(state, newSet) 
    return next;
  }

  reduceRemoveCard(state, action) {
    let nextUnordered = immutableUtils
                        .updateCollectionItem(state,
                        l => l.cards.indexOf(action.cardId) !== -1,
                        list => ({ ...list,
                                   cards: list.cards.filter(c => c !== action.cardId )}))

    let next = this.retainListsOrder(state, nextUnordered) 
    return next
  }

  reduceChangeName(state, action) {
   let nextUnordered = immutableUtils.updateCollectionItem(state,
                                      l => l.id == action.listId,
                                      list => ({ ...list, name: action.listName}))
   
   let next = this.retainListsOrder(state, nextUnordered) 
   return next
  }


  reduceAddList(state, action) {
    let next = [ ...state, { id: action.id,
                             name: action.name,
                             color: action.color,
                             cards: [] }] 
    return next
  }
}
