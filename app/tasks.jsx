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

  render() {
    debugger
    return (
      <div>
        <ul>
          {
            this.props.tasks.map((t) => 
                                <li key={t.id}>
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
