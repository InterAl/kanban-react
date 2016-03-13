import BaseReducer from './infra/baseReducer'
import _ from 'lodash'

export default class TasksReducer extends BaseReducer {
  constructor() {
    super({
      slice: "tasks",
      actions: {
        "TOGGLE_TASK": "reduceToggleTask"
      }})
  }

  reduceToggleTask(tasks, action) {
    let partition = _(tasks).partition({id: action.taskId}).value()
    let foundTasks = partition[0]

    if (foundTasks.length == 0)
      throw new Error(`No tasks were found for taskId ${action.taskId}`)

    if (foundTasks.length > 1)
      throw new Error(`Found ${foundTasks.length} tasks with taskId ${action.taskId}`)

    let taskToUpdate = foundTasks[0]
    let nextTaskState = {...taskToUpdate, done: !taskToUpdate.done}

    let nextStateUnordered = [nextTaskState, ...partition[1]]
    let nextStateOrdered = tasks.map(t => nextStateUnordered.find(t2 => t2.id == t.id))

    return nextStateOrdered
  }
}
