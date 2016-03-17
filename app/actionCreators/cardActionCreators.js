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

  moveCard(cardId, listId, dropLocationIdx) {
    return { 
      type: 'MOVE_CARD',
      cardId: Number(cardId),
      listId,
      dropLocationIdx: dropLocationIdx || 0 
    } 
  }
}
