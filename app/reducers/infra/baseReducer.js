import _ from 'lodash'

export default class BaseReducer {

  constructor(...args) {
    let reducerActionTypes,
        slice;

    if (typeof(args[0]) == "object") {
      reducerActionTypes = args[0].actions ? _(args[0].actions).map((v, k) => k).value() : args[0].reducerActionTypes 
      this.actions = args[0].actions
      slice = args[0].slice
    } else {
      slice = args[0]
      reducerActionTypes = args[1]
    }

    this.slice = slice
    this.reducerActionTypes = reducerActionTypes
    this.name = slice ? slice.split(".").reverse()[0] : null
    this.childReducers = []
  }

  doesHandleAction(actionType) {
    return this.reducerActionTypes && this.reducerActionTypes.indexOf(actionType) !== -1;
  }

  isPlainObject(obj) {
    return typeof(obj) == "object" && obj.constructor !== Array
  }

  isFunction(obj) {
    return typeof(obj) === "function" 
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

    if (this.isPlainObject(root.initialState)) 
      rootState = Object.assign({}, root.initialState, ...childrenState)
    else
      rootState = root.initialState

    return rootState
  }

  _reduce(state, action) {
    if (!state || Object.keys(state).length == 0) {
      let init = this.initializeTree(this)
      return init
    }

    let nextSlice = this.isPlainObject(state) ?
                    this._reduceChildren(state, action) :
                    state  //primitive or array

    if (this.doesHandleAction(action.type)) {
     let actionsReduceFun = this.actions && this[this.actions[action.type]].bind(this) 
     let defaultReduceFun = this.reduce

     if (!actionsReduceFun && !defaultReduceFun)
       throw new Error(`No reduce function was found!`)

     let reduceFun = (actionsReduceFun || defaultReduceFun).bind(this)

      nextSlice = reduceFun(nextSlice, action)
    }

    return nextSlice
  }

  _reduceChildren(state, action) {
    let self = this
    
    let nextSubslices = Object.keys(state).map(sliceName => {
      let childReducer = self.childReducers.find(r => r.slice == self.getSliceFullName(sliceName))
      let substate = state[sliceName]

      if (childReducer) {
        substate = childReducer._reduce(substate, action)
      }

      return {[sliceName]: substate}
    })

    let nextSlice = Object.assign({}, ...state, ...nextSubslices)
    return nextSlice
  }
}
