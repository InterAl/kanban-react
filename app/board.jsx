import React, {Component} from 'react'
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux'
import cards from './cardsData'
import List from './list'
import {DragDropContext, DropTarget} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import BigAdditionButton from './bigAdditionButton';
import listActions from './actionCreators/listActionCreator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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

    function getDomElementDistanceFromMouse(mouseX, listElement, side) {
      let rect = listElement.boundedRect
      return Math.abs(rect[side] - mouseX)
    }

    function getDomlistElements(component) {
      let listElement = findDOMNode(component)
      let listsContainerEle = listElement.getElementsByClassName("lists-container")[0]
      let listEles = listsContainerEle.getElementsByClassName("list-container")

      listEles = Array.prototype.slice.call(listEles)

      return listEles.map(e => {
        let element = e.getElementsByClassName("list")[0]
        let boundedRect = element.getBoundingClientRect()

        return {
          listId: e.getAttribute("data-list-id"),
          element,
          boundedRect
        }})
    }

    function getTopElement(listElements) {
      return _(listElements).minBy(e => e.boundedRect.top)
    }

    function getClosestElementToMouse(listElements, mouseX) {
      let closestElement = _(listElements).minBy(e => {
        return getDomElementDistanceFromMouse(mouseX, e, 'right')
      })
      return closestElement
    }

    function getPreviewMarker(monitor, component) {
      let mouseOffset = monitor.getClientOffset()
      if (!mouseOffset) return;

      let mouseX = mouseOffset.x;
      let domlistElements = getDomlistElements(component)
      let closestElement = getClosestElementToMouse(domlistElements, mouseX)
      let previewMarkerX, previewlistId = closestElement ? closestElement.listId : "-1"

      if (domlistElements && domlistElements.length > 0) {
        let topElement = getTopElement(domlistElements)

        if (closestElement == topElement) {
          let closestSide = _(['left', 'right']).minBy(side => getDomElementDistanceFromMouse(mouseX, topElement, side))
          previewMarkerX = topElement.boundedRect[closestSide]
          previewlistId = closestSide == 'left' ? -1 : previewlistId
        } else {
          previewMarkerX = closestElement.boundedRect.right
        }
      } else {
        previewMarkerX = mouseX
      }

      return {
        previewMarkerX,
        previewlistId
      }
    }

    function setPreviewMarker(monitor, component) {
      let { previewlistId, previewMarkerX } = getPreviewMarker(monitor, component)

      component.setState({
        previewlistId,
        previewMarkerX
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
        component.setState({previewMarkerX: null})
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

    let previewDropMarker = this.props.isOver && this.state.previewMarkerX ?
      <div className="preview-card-ver-line" style={{left: this.state.previewMarkerX}}>
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
