export default {

  changeTitle({ cardId, title}) {
    return {
      type: "CARD_CHANGE_TITLE",
      cardId,
      title
    }
  },

  changeDescription({ cardId, description}) {
    return {
      type: "CARD_CHANGE_DESCRIPTION",
      cardId,
      description
    }
  },

  addCard(cardId) {
    return {
      type: "ADD_CARD",
      cardId
    }
  },

  removeCard(cardId) {
    return {
      type: "REMOVE_CARD",
      cardId
    }
  },

  moveCard(cardId, listName) {
    return { 
      type: 'MOVE_CARD',
      cardId: Number(cardId),
      listName: listName
    } 
  }
}
