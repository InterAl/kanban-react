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
  }
}
