import React, {Component} from 'react'
import {connect} from 'react-redux' 
import taskActions from './actionCreators/taskActionsCreator'
import TaskAdd from './taskAdd.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles/tasks.css'

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
    let tasks = this.props.tasks.map((t) => 
       <li key={t.id} >
        <span onClick={this.removeTask.bind(this, t.id)} className="task-remove-btn">{"✘"}</span>
        <input 
          type="checkbox" 
          defaultChecked={t.done} 
          onClick={this.setAsDone.bind(this, t)} />

        <span style={this.getTaskStyle(t)}>{t.name}</span>
      </li>
    )

    return (
      <div>
        <ul style={{listStyleType: 'none', paddingLeft: '0%'}}>
        <ReactCSSTransitionGroup
          transitionName="card"
          transitionAppear={true} 
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          { tasks }
        </ReactCSSTransitionGroup>

          <li style={{marginTop: 5}}>
            <TaskAdd cardId={this.props.cardId}/>
          </li>

        </ul>
      </div>
    );
  }
}

let connector = connect()(Tasks);

export default connector
