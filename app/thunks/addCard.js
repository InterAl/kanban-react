import cardActions from '../actionCreators/cardActionCreators'
import _ from 'lodash'
import idGen from '../utils/idGen';

export default function(listId) {
  return (dispatch, getState) => {
    let state = getState()
    let cards = state.board.cards
    let list = state.board.lists.find(l => l.id == listId)
    let moveLocationIdx = list.cards.length
    let cardId = idGen.getNextId(cards)
    let addCardAction = cardActions.addCard(cardId)
    let moveCardAction = cardActions.moveCard(cardId, listId, moveLocationIdx)

    dispatch(addCardAction)
    dispatch(moveCardAction)
  }
}
