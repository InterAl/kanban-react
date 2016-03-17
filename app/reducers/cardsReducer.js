import BaseReducer from './infra/baseReducer'
import RootReducer from './infra/rootReducer'
import TasksReducer from './tasksReducer'
import cards from '../cardsData'
import _ from 'lodash'
import immutableUtils from '../utils/immutableUtils'

class CardReducer extends RootReducer {
  constructor() {
    super({
      reducers: [TasksReducer],
      actions: {
        "TOGGLE_DESCRIPTION": "reduceToggleDescription",
        "CARD_CHANGE_TITLE": "reduceChangeTitle",
        "CARD_CHANGE_DESCRIPTION": "reduceChangeDescription"
      }
    })
  }

  reduceChangeTitle(state, action) {
    return { ...state, title: action.title }
  }

  reduceChangeDescription(state, action) {
    return { ...state, description: action.description }
  }

  reduceToggleDescription(state, action) {
    return {...state, showDescription: !state.showDescription }
  }
}

export default class CardsReducer extends BaseReducer {
  constructor() {
    let cardReducer = new CardReducer()

    let actions = BaseReducer.inheritActionsFromReducer(cardReducer, "updateCard")
    actions = {
                ...actions,
                "ADD_CARD": "addCard",
                "REMOVE_CARD": "removeCard"
              }

    super({
            slice: "board.cards",
            actions
          })

    this.initialState = cards 
    this.cardReducer = cardReducer
  }

  updateCard(cards, action) {
    let nextState = immutableUtils.updateCollectionItem(cards,
                                                        {id: action.cardId},
                                                        cardToUpdate => this.cardReducer._reduce(cardToUpdate, action))  
    return nextState
  }

  addCard(cards, action) {
    let newCard = {
      id: action.cardId,
      title: "Title",
      description: "Description",
      status: "",
      tasks: []
    }

    return [ ...cards, newCard ]
  }

  removeCard(cards, action) {
    return cards.filter(c => c.id !== action.cardId)
  }
}
