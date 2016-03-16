import React, {Component} from 'react'
import {connect} from 'react-redux'
import cards from './cardsData'
import List from './list'
import cardActions from './actionCreators/cardActionCreators'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class Board extends Component {
  constructor () {
    super();
  }

  onCardDropped(listName, cardId) {
    let action = cardActions.moveCard(cardId, listName)
    this.props.dispatch(action)
  }

  render () {
    console.log("board props", this.props)
    const lists = this.props.lists.map(l => 
          <List key={l.name} cardDropped={this.onCardDropped.bind(this)} name={l.name} cards={l.cards} color={l.color} />
      );
        
    return (
      <div style={{background: this.props.background}}>
        <button onClick={() => this.props.dispatch({type: 'CHANGE_BACKGROUND',
          background: this.props.background == 'purple' ? 'yellow' : 'purple'})}>
           change background
        </button>
      <br/>
          {lists}
      </div>
    );
  }
}

let boardContext = DragDropContext(HTML5Backend)(Board)

let boardConnector = connect(state => {
  return state.board;
})(boardContext);

export default boardConnector;
