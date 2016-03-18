import React, {Component} from 'react'
import {connect} from 'react-redux'
import cards from './cardsData'
import List from './list'
import {DragDropContext, DropTarget} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import BigAdditionButton from './bigAdditionButton';
import listActions from './actionCreators/listActionCreator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import dropMarkerCalc from './utils/dropMarkerCalc';

class Board extends Component {
  constructor () {
    super();
    this.state = {}
  }

  onClickListAdd(ev) {
    let action = listActions.addList(this.props.lists, "#CDEFFA")
    this.props.dispatch(action)
  }

  static dropTarget() {

    let getPreviewMarker = dropMarkerCalc({
      containerName: "lists-container", 
      itemContainerName: "list-container",
      itemName: "list",
      elementIdAttr: "data-list-id",
      direction: "horizontal"
    })

    function setPreviewMarker(monitor, component) {
      let { previewitemId, previewMarkerLoc } = getPreviewMarker(monitor, component)

      component.setState({
        previewlistId: previewitemId,
        previewMarkerLoc
      })
    }

    function getDraggedItem(monitor) {
        let item = monitor.getItem() || dragItemContainer.getDragItem()
        return item
    }

    return {
      canDrop(props, monitor) {
        return true
      },

      hover(props, monitor, component) {
        setPreviewMarker(monitor, component)
      },

      drop(props, monitor, component) {
        console.log("dropped on board!");
        let item = getDraggedItem(monitor)
        let action = listActions.moveList(item.listId, component.state.previewlistId)
        props.dispatch(action)
        component.setState({previewMarkerLoc: null})
      },
    };
  } 

  static collectTarget(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType()
    };
  }

  render () {
    const lists = this.props.lists.map(l =>
       <span className="list-container" data-list-id={l.id}>
         <List key={l.id} id={l.id} name={l.name} cards={l.cards} color={l.color} />
       </span>
    );

    let previewDropMarker = this.props.isOver && this.state.previewMarkerLoc ?
      <div className="preview-card-ver-line" style={{left: this.state.previewMarkerLoc}}>
      </div> : null

    return this.props.connectDropTarget(
      <div>
        { previewDropMarker }

        <span className="lists-container">
          <ReactCSSTransitionGroup
            transitionName="card"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}> 
            {lists}
          </ReactCSSTransitionGroup>
        </span>

        <BigAdditionButton onClick={ this.onClickListAdd.bind(this)  }
                           className="add-list-btn"/>
      </div>
    );
  }
}

let dropTarget = DropTarget(props => ["LIST"], Board.dropTarget(), Board.collectTarget)(Board)
let boardContext = DragDropContext(HTML5Backend)(dropTarget)

let boardConnector = connect(state => {
  return state.board;
})(boardContext);

export default boardConnector;
