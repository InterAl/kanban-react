import _ from 'lodash'

export default class BaseReducer {

  constructor() {
    let reducerActionTypes,
        slice;

    if (typeof(arguments[0]) == "object") {
      reducerActionTypes = _(arguments[0].actions).map((v, k) => k).value()
      this.actions = arguments[0].actions
      slice = arguments[0].slice
    } else {
      slice = arguments[0]
      reducerActionTypes = arguments[1]
    }

    this.slice = slice
    this.reducerActionTypes = reducerActionTypes
    this.name = slice ? slice.split(".").reverse()[0] : null
    this.childReducers = []
  }

  doesHandleAction(actionType) {
    return this.reducerActionTypes && this.reducerActionTypes.indexOf(actionType) !== -1;
  }

  setChildReducer(child) {
    this.childReducers.push(child)
  }

  getSliceFullName(sliceName) {
    if (!this.slice)
      return sliceName;

    return `${this.slice}.${sliceName}`;
  }

  initializeTree(root) {
    if (!root) return;

    let childrenState = root.childReducers.map(r => { return { [r.name]: this.initializeTree(r) } })

    let rootState;

    if (typeof(root.initialState) == "object")
      rootState = Object.assign({}, root.initialState, ...childrenState)
    else
      rootState = root.initialState

    return rootState
  }

  _reduce(state, action) {
    if (Object.keys(state).length == 0) {
      let next = this.initializeTree(this)
      return next
    }

    let self = this,
        nextSlice;

    if (typeof(state) == "object" && state.constructor !== Array) {
      let nextSubslices = Object.keys(state).map(sliceName => {
        let childReducer = self.childReducers.find(r => r.slice == self.getSliceFullName(sliceName))
        let substate = state[sliceName]

        if (childReducer) {
          substate = childReducer._reduce(substate, action)
        }

        return {[sliceName]: substate}
      })

      nextSlice = Object.assign({}, ...state, ...nextSubslices)
    } else { //primitive
      nextSlice = state 
    }

    if (self.doesHandleAction(action.type)) {
      let reduceFun = typeof(self.reduce) === "function" ? 
                      self.reduce.bind(self) : 
                      self[self.actions[action.type]].bind(self)

      nextSlice = reduceFun(nextSlice, action)
    }

    return nextSlice
  }
}
