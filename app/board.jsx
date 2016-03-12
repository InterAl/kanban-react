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

let boardConnector = connect(state => {
  return { ...state.board };
})(Board);

export default boardConnector;
