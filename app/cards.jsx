import React, {Component} from 'react'
import {connect} from 'react-redux'
import Tasks from './tasks'
import './styles/card.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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

  render() {
    const card = this.props.cards.find(card => card.id == this.props.cardId);
    let cardDescription = card.showDescription ? <span>{ card.description }</span> : null;
    
    return (
      <div draggable="true" onDragStart={this.onDrag.bind(this)} className="card">
          <div className="card-ribbon"></div>
          <span onClick={this.toggleDescription.bind(this)} style={{cursor: 'pointer'}}>{"+\u00a0"}</span>
          <b>{card.title}</b>
          <br/>

          <ReactCSSTransitionGroup
            transitionName="card"
            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}>
            { cardDescription }
          </ReactCSSTransitionGroup>

          <Tasks key={card.id} tasks={card.tasks} />
      </div>
    );
  }
}

let connector = connect(state => {return {cards: state.board.cards};})(Card);

export default connector
