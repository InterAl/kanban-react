import React, {Component} from 'react'
import {DragSource} from 'react-dnd'
import {connect} from 'react-redux'
import Tasks from './tasks'
import './styles/card.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Editable from './editableElement'
import cardActions from './actionCreators/cardActionCreators'
import dragItemContainer from './utils/dragItemContainer'

export default class Card extends Component {
  constructor (props) {
    super(props);
  }

  static cardSource ()  {
    return {
      beginDrag (props) {
        let dragItem = {
          cardId: props.cardId
        }

        console.log("begin dragging card", dragItem);
        dragItemContainer.setDragItem(dragItem) //due to a bug in react-dnd
        return dragItem
      }
    }
  }

  static collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }

  toggleDescription () {
    this.props.dispatch({type: "TOGGLE_DESCRIPTION", "cardId": this.props.cardId})
  }


  onTitleKeyUp(ev) {
    if (ev.keyCode == 13) {
      let action = cardActions.changeTitle({ cardId: this.props.cardId,
                                             title: ev.target.value })
      this.props.dispatch(action)
    }
  }

  onDescriptionKeyUp(ev) {
    if (ev.keyCode == 13) {
      let action = cardActions.changeDescription({ cardId: this.props.cardId, 
                                                   description: ev.target.value })
      this.props.dispatch(action)
    }
  }

  onClickRemoveCard(ev) {
    let action = cardActions.removeCard(this.props.cardId)
    this.props.dispatch(action)
  }

  render() {
    const card = this.props.cards.find(card => card.id == this.props.cardId)

    if (!card) return null

    let cardDescription = card.showDescription ?
                            <Editable
                            content={ <span>{ card.description }</span> }
                            value={ card.description }
                            onKeyUp={ this.onDescriptionKeyUp.bind(this) } /> : null;


    return this.props.connectDragSource(
      <div className="card">
        
        <span onClick={this.onClickRemoveCard.bind(this)}
          className="remove-card-btn">
          <b>✘</b>
        </span>

        <div className="card-ribbon"></div>

        <span onClick={this.toggleDescription.bind(this)}
          style={{cursor: 'pointer'}}>{"+\u00a0"}
        </span>

        <div className="card-title">
          <Editable content={ <b>{card.title}</b> } size={15} value={ card.title } 
                    onKeyUp={ this.onTitleKeyUp.bind(this) } />
        </div>

        <div className="card-description">
          <ReactCSSTransitionGroup
            transitionName="card"
            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}>
            { cardDescription }
          </ReactCSSTransitionGroup>
        </div>

        <Tasks key={card.id} cardId={card.id} tasks={card.tasks} />
      </div>
    );
  }
}

let dragSource = DragSource("CARD", Card.cardSource(), Card.collect)(Card)
let connector = connect(state => {return {cards: state.board.cards};})(dragSource);

export default connector
