import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import taskActions from './actionCreators/taskActionsCreator'
import {connect} from 'react-redux'

class TaskAdd extends Component {
  constructor() {
    super()
    this.state = {
      editMode: false
    }
  }

  toggleEditMode(value) {
    this.setState({
      editMode: value
    })
  }

  inputOnBlur(ev) {
    this.toggleEditMode(false)
  }

  inputOnMount(component) {
    let input = ReactDOM.findDOMNode(component); 
    input && input.focus()
  }

  inputOnClick(ev) {
    if (ev.keyCode == 13) {
      let action = taskActions.addTask(this.props.cardId, ev.target.value) 
      this.props.dispatch(action)
      this.toggleEditMode(false)
    }
  }

  render () {
    let input = (
      <input
        type="text"
        size={10}
        onKeyUp={this.inputOnClick.bind(this)}
        onBlur={this.inputOnBlur.bind(this)}
        ref={this.inputOnMount.bind(this)} />
    )

    let plusSign = (
      <span onClick={ this.toggleEditMode.bind(this, true) }
        style={{cursor:'pointer', color: 'blue', marginRight:5}}>
        <b>{'\u2795'}</b>
      </span>
    )

    return (
      <div>
        { plusSign }
        { this.state.editMode ? input : null }
      </div>
    )
  }
}

export default connect()(TaskAdd)
