import BaseReducer from './infra/baseReducer'

export default class BackgroundReducer extends BaseReducer {
  constructor() {
    super('board.background', 'CHANGE_BACKGROUND')
    this.initialState = 'purple'
  }

  reduce(state, action) {
   return action.background
  }
}
