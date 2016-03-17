import BaseReducer from './infra/baseReducer'
import _ from 'lodash'
import immutableUtils from '../utils/immutableUtils'

export default class TasksReducer extends BaseReducer {
  constructor() {
    super({
      slice: "tasks",
      actions: {
        "TOGGLE_TASK": "reduceToggleTask",
        "REMOVE_TASK": "reduceRemoveTask",
        "ADD_TASK": "reduceAddTask"
      }})
  }

  reduceRemoveTask(tasks, action) {
    let nextState = _(tasks).filter(t => t.id !== action.taskId).value()
    return nextState
  }

  reduceToggleTask(tasks, action) {

    let nextStateUnordered = immutableUtils.updateCollectionItem(tasks, 
                                                                 {id: action.taskId},
                                                                 task => ({...task, done: !task.done}))

    let nextStateOrdered = tasks.map(t => nextStateUnordered.find(t2 => t2.id == t.id))

    return nextStateOrdered
  }

  reduceAddTask(tasks, action) {
    let newTask = {
      id: _.max(tasks.map(t => t.id)) + 1 || 1,
      name: action.name,
      done: false
    }

    return [ ...tasks, newTask ]
  }


}
