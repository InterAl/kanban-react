import BaseReducer from './infra/baseReducer'
import RootReducer from './infra/rootReducer'
import cards from '../cardsData'
import _ from 'lodash'

class CardReducer extends RootReducer {
  constructor() {
    super({
      reducers: [],
      actions: {
        "TOGGLE_DESCRIPTION": "reduceToggleDescription"
      }
    })
  }

  reduceToggleDescription(state, action) {
    return {...state, showDescription: !state.showDescription }
  }
}

export default class CardsReducer extends BaseReducer {
  constructor() {
    super({
            slice: "board.cards",
            actions: {
              "TOGGLE_TASK": "updateCard",
              "TOGGLE_DESCRIPTION": "updateCard"
            }
          })

    this.initialState = cards 
    this.cardReducer = new CardReducer()
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
