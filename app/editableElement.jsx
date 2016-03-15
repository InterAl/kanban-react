import _ from 'lodash'
import React, {Component} from 'react'

export default class EditableElement extends Component {

  constructor() {
    super()

    this.state = {
      editable: false
    }
  }

  toggleEdit(value, ev) {
    this.setState({ editable: value })
  }

  onKeyUp(ev) {
    if (ev.keyCode == 13) {
      this.toggleEdit(false)
    }  
  }

  onChangeInput(ev) {
    this.props.value = ev.target.value
    this.forceUpdate()
  }

  textInputSelectAll(component) {
    let input = React.findDOMNode(component); 
    input && input.setSelectionRange(0, input.value.length); 
  }

  render() {
    let element

    if (!this.state.editable) {
      element = this.props.content
    } else {
      element = <input type="text"
                       ref={ this.textInputSelectAll.bind(this) } 
                       onChange={ this.onChangeInput.bind(this) }  
                       {...this.props} />
    } 

    return ( <span onClick={ this.toggleEdit.bind(this, true) } onKeyUp={ this.onKeyUp.bind(this) }>
              { element }
             </span> )
  }
}
