import React, {Component} from 'react'

export default class Tasks extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.state.tasks = this.props.tasks;
  }

  getTaskStyle(task) {
    const taskStyle = task.done ? {"textDecoration": 'line-through'} : null;
    return taskStyle;
  }

  setAsDone(task) {
    task.done = !task.done;
    this.setState(this.state);
  }

  render() {
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
