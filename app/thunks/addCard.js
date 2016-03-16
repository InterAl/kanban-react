import cardActions from '../actionCreators/cardActionCreators'
import _ from 'lodash'

export default function(listName) {
  return (dispatch, getState) => {
    let state = getState()
    let cards = state.board.cards
    let list = state.board.lists.find(l => l.name == listName)
    let moveLocationIdx = list.cards.length
    let cardId = _.max(cards.map(c => c.id)) + 1

    let addCardAction = cardActions.addCard(cardId)
    let moveCardAction = cardActions.moveCard(cardId, listName, moveLocationIdx)

    dispatch(addCardAction)
    dispatch(moveCardAction)
  }
}
