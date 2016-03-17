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

  render () {
    console.log("board props", this.props)
    const lists = this.props.lists.map(l =>
          <List key={l.id} id={l.id} name={l.name} cards={l.cards} color={l.color} />
      );

    return (
      <div>
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
