export default {
  
  setAsDone(taskId, cardId) {
    return {
      type: "TOGGLE_TASK",
      taskId,
      cardId
    }
  },

  removeTask(taskId, cardId) {
    return {
      type: "REMOVE_TASK",
      taskId,
      cardId
    }
  },

  addTask(cardId, name) {
    return {
      type: "ADD_TASK",
      cardId,
      name
    }
  }

}
