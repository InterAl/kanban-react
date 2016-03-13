import BaseReducer from "../app/reducers/infra/baseReducer"
import RootReducer from "../app/reducers/infra/rootReducer"
import assert from "assert"

class ChildReducer extends BaseReducer {
  constructor() {
    super('foo', 'ACTION_1')
    this.initialState = "some state"
  }

  reduce(state, action) {
    switch (action.type) {
      case 'ACTION_1':
        return "state change"
      default:
        return state
    }
  }
}

class Reducer extends RootReducer {

  constructor(initialState) {
    super({reducers: [ChildReducer], reducerActionTypes: ["ACTION_1"]})
    this.initialState = initialState
  }

  reduce(state, action) {
    switch (action.type) {
      case 'ACTION_1':
        return {...state, initialNode:  "root state change"}
      default:
        return state
    }
  }

}

describe('Reducer', () => {
  it('RootReducer initial state', () => {
    let initValue = {"initialNode": "init value"}
    let reducer = new Reducer(initValue)
    let nextState = reducer._reduce(null, {type: "init"})
    assert.equal(nextState.initialNode, "init value")
    assert.equal(nextState.foo, "some state")
  });

  it('RootReducer next state', () => {
    let initValue = {"initialNode": "init value"}
    let reducer = new Reducer(initValue)
    let initState = reducer._reduce(null, {type: "init"})
    let nextState = reducer._reduce(initState, {type: 'ACTION_1'}) 
    assert.equal(nextState.initialNode, "root state change")
    assert.equal(nextState.foo, "state change")
  });
});
