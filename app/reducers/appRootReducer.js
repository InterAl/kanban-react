import allReducers from '.'
import RootReducer from './infra/rootReducer'

let reducer = new RootReducer({reducers: allReducers})

export default (state = {}, action) => reducer._reduce(state, action)
