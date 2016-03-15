import cardActions from '../actionCreators/cardActionCreators'
import _ from 'lodash'

export default function(listName) {
  return (dispatch, getState) => {
    let cards = getState().board.cards
    let cardId = _.max(cards.map(c => c.id)) + 1

    let addCardAction = cardActions.addCard(cardId)
    let moveCardAction = cardActions.moveCard(cardId, listName)

    dispatch(addCardAction)
    dispatch(moveCardAction)
  }
}
