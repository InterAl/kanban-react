import _ from 'lodash'
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import './styles/form.css'

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
    this.setState({overriddenInputValue: ev.target.value})
  }

  textInputSelectAll(component) {
    let input = findDOMNode(component);
    input && input.focus()
  }

  onBlurInput(ev) {
    this.toggleEdit(false)
  }

  render() {
    let element

    if (!this.state.editable) {
      element = this.props.content
    } else {
      element = <input type="text"
                       className="form"
                       ref={ this.textInputSelectAll.bind(this) }
                       onChange={ this.onChangeInput.bind(this) }
                       onBlur={ this.onBlurInput.bind(this) }

                       {...{...this.props,
                         value: this.state.overriddenInputValue !== undefined ? 
                                this.state.overriddenInputValue : this.props.value }} />
    }

    return ( <span onClick={ this.toggleEdit.bind(this, true) }
                   onKeyUp={ this.onKeyUp.bind(this) }>
              { element }
             </span> )
  }
}
