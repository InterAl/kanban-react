import idGen from '../utils/idGen';

export default {
  changeName(listId, listName) {
    return {
      type: "CHANGE_LIST_NAME",
      listId,
      listName
    }
  },

  addList(lists, color) {
    let id = idGen.getNextId(lists)

    return {
      type: "ADD_LIST",
      id,
      color,
      name: `List ${id}`
    }
  },

  removeList(id) {
    return {
      type: "REMOVE_LIST",
      id 
    }
  },

  moveList(id, targetListId) {
     return {
      type: "MOVE_LIST",
      id,
      targetListId
     }
  }
}
