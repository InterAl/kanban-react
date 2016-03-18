import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux'
import Card from './cards.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles/list.css'
import './styles/preview-card.css'
import cardActions from './actionCreators/cardActionCreators'
import addCardThunk from './thunks/addCard'
import {DropTarget, DragSource} from 'react-dnd'
import dragItemContainer from './utils/dragItemContainer'
import _ from 'lodash'
import EditableElement from './editableElement';
import listActions from './actionCreators/listActionCreator';
import BigAdditionButton from './bigAdditionButton'
import dropMarkerCalc from './utils/dropMarkerCalc'

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  static dropTarget() {

    let getPreviewMarker = dropMarkerCalc({
      containerName: "cards-container",
      itemContainerName: "card-container",
      itemName: "card",
      elementIdAttr: "data-card-id",
      direction: "vertical"
    })

    function setPreviewMarker(monitor, component) {
      let { previewitemId, previewMarkerLoc } = getPreviewMarker(monitor, component)

      component.setState({
        previewCardId: previewitemId,
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
        console.log("dropped");
        let item = getDraggedItem(monitor)
        let dropLocationIdx = _(props.cards).findIndex(cardId => cardId == component.state.previewCardId) + 1
        let action = cardActions.moveCard(item.cardId, props.id, dropLocationIdx)
        props.dispatch(action)
        component.setState({previewMarkerLoc: null})
      },
    };
  }

  static listSource ()  {
    return {
      beginDrag (props) {
        let dragItem = {
          listId: props.id
        }

        console.log("begin dragging list", dragItem);
        dragItemContainer.setDragItem(dragItem)
        //due to a bug in react-dnd's
        return dragItem
      }
    }
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

  static collectSource(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }

  onClickAddCardBtn(ev) {
    this.props.dispatch(addCardThunk(this.props.id))
  }

  onListNameKeyUp(ev) {
    if (ev.keyCode == 13) {
      let action = listActions.changeName(this.props.id, ev.target.value)
      this.props.dispatch(action)
    }
  }

  onClickRemoveList(ev) {
    let action = listActions.removeList(this.props.id)
    this.props.dispatch(action)
  }

  render() {
    let addCardBtn = (<BigAdditionButton
                      onClick={ this.onClickAddCardBtn.bind(this) }/>)

    let previewDropMarker = this.props.isOver && this.state.previewMarkerLoc ?
                                <hr className="preview-card-line"
                                    style={{ top: this.state.previewMarkerLoc + 'px' }}/> : null

    let listTitle = <EditableElement
                     content={ <h3 style={{"textAlign": "center"}}>{this.props.name}</h3> }
                     value={ this.props.name }
                     style={{"textAlign": "center"}}
                     onKeyUp={ this.onListNameKeyUp.bind(this) } />

    let cards = this.props.cards.map((c) =>
                              <span key={c} className="card-container" data-card-id={c}>
                                 <Card cardId={c} />
                                <br/>
                              </span>)
 
    return this.props.connectDragSource(this.props.connectDropTarget(

      <div className="list"
           style={{ background: this.props.color}}>
 
       <span onClick={this.onClickRemoveList.bind(this, this.props.id)}
         className="remove-card-btn">
         <b>✘</b>
       </span>

        { listTitle }

        { previewDropMarker }

        <div className="cards-container">

          <ReactCSSTransitionGroup
            transitionName="card"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}> 
            { cards }
          </ReactCSSTransitionGroup>

        </div>                         

        {addCardBtn}

     </div>

    ));
  }
}

let dropTarget = DropTarget(props => ["CARD"], List.dropTarget(), List.collectTarget)(List)
let dragSource = DragSource("LIST", List.listSource(), List.collectSource)(dropTarget)
let connector = connect()(dragSource);

export default connector;
