import _ from 'lodash'

export default {
  updateCollectionItem(collection, selector, updateFun) {
    let partition = _(collection).partition(selector).value()
    let foundItems = partition[0]

    if (foundItems.length == 0)
      throw new Error(`No items were found.`)

    if (foundItems.length > 1)
      throw new Error(`Found ${foundItems.length} items instead of 1.`)

    let itemToUpdate = foundItems[0]
    let nextItemState = updateFun(itemToUpdate) 
    let nextState = [nextItemState, ...partition[1]]

    return nextState
  }
}
