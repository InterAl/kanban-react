import React, {Component} from 'react'
import {connect} from 'react-redux'
import cards from './cardsData'
import List from './list'

class Board extends Component {
  constructor () {
    super();
  }

  onCardDropped(listName, cardId) {
    this.props.dispatch({ type: 'MOVE_CARD', cardId: Number(cardId), listName: listName })
  }

  render () {
    console.log("board props", this.props)
    const lists = this.props.lists.map(l => 
          <List key={l.name} cardDropped={this.onCardDropped.bind(this)} name={l.name} cards={l.cards} color={l.color} />
      );
        
    return (
      <div>
          {lists}
      </div>
    );
  }
}

let boardConnector = connect(state => {return {lists: state.board.lists}; } )(Board);

export default boardConnector;
