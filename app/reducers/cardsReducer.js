import BaseReducer from './infra/baseReducer'
import RootReducer from './infra/rootReducer'
import TasksReducer from './tasksReducer'
import cards from '../cardsData'
import _ from 'lodash'

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

    let actions = cardReducer.getActionTypesRecursively().reduce((p, c) => {
      p[c] = "updateCard"
      return p
    }, {})

    super({
            slice: "board.cards",
            actions 
          })

    this.initialState = cards 
    this.cardReducer = cardReducer
  }

  updateCard(cards, action) {
    let cardsPartition = _(cards).partition({id: action.cardId}).value()
    let foundCards = _(cardsPartition).first()

    if (foundCards.length == 0)
      throw new Error(`CardId ${action.cardId} was not found.`)

    if (foundCards.length > 1)
      throw new Error(`Found ${foundCards.length} cards with the same cardId: ${action.cardId}`)
    
    let cardToUpdate = foundCards[0]
    let nextCardState = this.cardReducer._reduce(cardToUpdate, action)
    let nextState = [nextCardState, ...cardsPartition[1]] 
    
    return nextState
  }
}
