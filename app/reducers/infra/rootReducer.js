import BaseReducer from './baseReducer'

export default class RootReducer extends BaseReducer {
    constructor(...args) {
     super(...args); 
     this.reducers = (args[0].reducers && args[0].reducers.map(reducer => new reducer())) || []
     this.buildReducerTree()
     this.initialState = {}
    }

    buildReducerTree() {
      //Not very efficient, but only happens upon application startup anyway.
      for (var reducer of this.reducers) {
        let slice = reducer.slice
        let sliceParts = slice.split('.')
        let potentialParents = sliceParts
                               .reduce((p, c, i) => p.concat(i > 0 ? `${p[i-1]}.${c}` : c), [])
                               .slice(0, -1)

        potentialParents.reverse()

        let reducerParent = null

        while (!reducerParent && potentialParents.length > 0) {
          let potentialParent = potentialParents.shift()
          reducerParent = this.reducers.find(r => r.slice == potentialParent)
        }

        if (!reducerParent && sliceParts.length > 1)
          throw new Error(`No reducer parent found for reducer '${slice}'`)

        //If no parent reducer was found, then the root reducer is the parent.
        reducerParent = reducerParent || this
        reducerParent.setChildReducer(reducer)
      }
    }

    reduce(state = {}, action) {
      return state;
    }
}
