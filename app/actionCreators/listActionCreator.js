export default {
  changeName(listId, listName) {
    return {
      type: "CHANGE_LIST_NAME",
      listId,
      listName
    }
  }
}
