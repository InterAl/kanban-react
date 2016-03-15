import React, {Component} from 'react'
import {connect} from 'react-redux'
import Tasks from './tasks'
import './styles/card.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Editable from './editableElement'
import cardActions from './actionCreators/cardActionCreators'

export default class Card extends Component {
  constructor (props) {
    super(props);
  }

  toggleDescription () {
    this.props.dispatch({type: "TOGGLE_DESCRIPTION", "cardId": this.props.cardId})
  }

  onDrag (ev) {
    console.log("dragging");
    ev.dataTransfer.setData('text', this.props.cardId);
  }

  onTitleKeyUp(ev) {
    if (ev.keyCode == 13) {
      let action = cardActions.changeTitle({ cardId: this.props.cardId, title: ev.target.value })
      this.props.dispatch(action)
    }
  }

  onDescriptionKeyUp(ev) {
    if (ev.keyCode == 13) {
      let action = cardActions.changeDescription({ cardId: this.props.cardId, description: ev.target.value })
      this.props.dispatch(action)
    }
  }

  onClickRemoveCard(ev) {
    let action = cardActions.removeCard(this.props.cardId)
    this.props.dispatch(action)
  }

  render() {
    const card = this.props.cards.find(card => card.id == this.props.cardId)

    let cardDescription = card.showDescription ?
                            <Editable
                            content={ <span>{ card.description }</span> }
                            value={ card.description }
                            onKeyUp={ this.onDescriptionKeyUp.bind(this) } /> : null;
            
    
    return (
      <div draggable="true" onDragStart={this.onDrag.bind(this)} className="card">
          <span onClick={this.onClickRemoveCard.bind(this)} className="remove-card-btn"><b>✘</b></span>
          <div className="card-ribbon"></div>
          <span onClick={this.toggleDescription.bind(this)} style={{cursor: 'pointer'}}>{"+\u00a0"}</span>
          <Editable content={ <b>{card.title}</b> } value={ card.title } onKeyUp={ this.onTitleKeyUp.bind(this) } />
          <br/>

          <ReactCSSTransitionGroup
            transitionName="card"
            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}>
            { cardDescription }
          </ReactCSSTransitionGroup>

          <Tasks key={card.id} cardId={card.id} tasks={card.tasks} />
      </div>
    );
  }
}

let connector = connect(state => {return {cards: state.board.cards};})(Card);

export default connector
