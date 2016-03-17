import React, {Component} from 'react'
import {connect} from 'react-redux'
import cards from './cardsData'
import List from './list'
import cardActions from './actionCreators/cardActionCreators'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import BigAdditionButton from './bigAdditionButton';
import listActions from './actionCreators/listActionCreator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Board extends Component {
  constructor () {
    super();
  }

  onClickListAdd(ev) {
    let action = listActions.addList(this.props.lists, "#CDEFFA")
    this.props.dispatch(action)
  }

  render () {
    console.log("board props", this.props)
    const lists = this.props.lists.map(l =>
          <List key={l.id} id={l.id} name={l.name} cards={l.cards} color={l.color} />
      );

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="card"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}> 
          {lists}
        </ReactCSSTransitionGroup>

        <BigAdditionButton onClick={ this.onClickListAdd.bind(this)  }
                           className="add-list-btn"/>
      </div>
    );
  }
}

let boardContext = DragDropContext(HTML5Backend)(Board)

let boardConnector = connect(state => {
  return state.board;
})(boardContext);

export default boardConnector;
