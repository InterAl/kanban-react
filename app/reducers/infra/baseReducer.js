import _ from 'lodash'

export default class BaseReducer {

  constructor(...args) {
    let reducerActionTypes,
        slice,
        arg = args[0];

    if (typeof(arg) == "object") {
      reducerActionTypes = arg.actions ? _(arg.actions).map((v, k) => k).value() : arg.reducerActionTypes 
      this.actions = arg.actions
      slice = arg.slice
    } else {
      slice = arg
      reducerActionTypes = args[1]
    }

    this.slice = slice
    this.reducerActionTypes = reducerActionTypes
    this.name = slice ? slice.split(".").reverse()[0] : null
    this.childReducers = []
  }

  static inheritActionsFromReducer(reducer, reduceMethodName) {
    let actions = reducer.getActionTypesRecursively().reduce((p, c) => {
      p[c] = reduceMethodName
      return p
    }, {})

    return actions
  }

  getActionTypesRecursively() {
    let childrenActionTypes = _(this.childReducers).map(r => r.getActionTypesRecursively()).flatten().value()
    let allActionTypes = childrenActionTypes.concat(this.reducerActionTypes)
    return allActionTypes
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
    if (!state || (this.isPlainObject(state) && Object.keys(state).length == 0)) {
      let init = this.initializeTree(this)
      return init
    }

    let nextState = this.isPlainObject(state) ?
                    this._reduceChildren(state, action) :
                    state  //primitive or array

    if (this.doesHandleAction(action.type)) {
      let actionsReduceFun = this.actions && this[this.actions[action.type]].bind(this) 
      let defaultReduceFun = this.reduce

      if (!actionsReduceFun && !defaultReduceFun)
        throw new Error(`No reduce function was found!`)

      let reduceFun = (actionsReduceFun || defaultReduceFun).bind(this)

      nextState = reduceFun(nextState, action)
    }

    return nextState
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
