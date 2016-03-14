import React, {Component} from 'react'
import {connect} from 'react-redux' 
import taskActions from './actionCreators/taskActionsCreator'

export default class Tasks extends Component {
  constructor (props) {
    super(props);
  }

  getTaskStyle(task) {
    const taskStyle = task.done ? {"textDecoration": 'line-through'} : null;
    return taskStyle;
  }

  setAsDone(task) {
    let action = taskActions.setAsDone(task.id, Number(this.props.cardId))
    this.props.dispatch(action)
  }

  removeTask(taskId, cardId) {
    let action = taskActions.removeTask(taskId, Number(this.props.cardId))
    this.props.dispatch(action)
  }

  render() {
    return (
      <div>
        <ul style={{"list-style-type": 'none'}}>
          {
            this.props.tasks.map((t) => 
                                 <li key={t.id} >
                                  <span onClick={this.removeTask.bind(this, t.id)} style={{cursor: 'pointer', color: 'red'}}>{"✘"}</span>
                                  <input 
                                    type="checkbox" 
                                    defaultChecked={t.done} 
                                    onClick={this.setAsDone.bind(this, t)} />

                                  <span style={this.getTaskStyle(t)}>{t.name}</span>
                                </li>)
          }
        </ul>
      </div>
    );
  }
}

let connector = connect()(Tasks);

export default connector
