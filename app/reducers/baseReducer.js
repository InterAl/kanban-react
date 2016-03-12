export default class BaseReducer {

  constructor(slice, reducerActionTypes) {
    this.reducerActionTypes = reducerActionTypes
    this.slice = slice
    this.name = slice ? slice.split(".").reverse()[0] : null
    this.childReducers = []
  }

  doesHandleAction(actionType) {
    return this.reducerActionTypes.indexOf(actionType) !== -1;
  }

  setChildReducer(child) {
    this.childReducers.push(child)
  }

  getSliceFullName(sliceName) {
    if (!this.slice)
      return sliceName;

    return `${self.slice}.${sliceName}`;
  }

  _reduce(state, action) {
    debugger;
    if (Object.keys(state).length == 0) {
      let next  = this.childReducers.map(r => { return { [r.name]: r.initialState } })
      next = Object.assign({}, ...next)
      return next
    }

    let self = this

    let nextSubslices = Object.keys(state).map(sliceName => {
      let reducer = self.childReducers.find(r => r.slice == self.getSliceFullName(sliceName))
      let substate = state[sliceName]

      if (reducer && reducer.doesHandleAction(action.type)) {
        substate = reducer._reduce(substate, action)
      }

      return {[sliceName]: substate}
    })

    let nextSlice = Object.assign({}, ...nextSubslices)
    nextSlice = self.reduce(nextSlice, action)
    return nextSlice
  }
}
