export default {
  setAsDone(taskId, cardId) {
    return {
      type: "TOGGLE_TASK",
      taskId,
      cardId
    }
  }
}
