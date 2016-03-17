import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux'
import Card from './cards.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles/list.css'
import './styles/preview-card.css'
import cardActions from './actionCreators/cardActionCreators'
import addCardThunk from './thunks/addCard'
import {DropTarget} from 'react-dnd'
import dragItemContainer from './utils/dragItemContainer'
import _ from 'lodash'
import EditableElement from './editableElement';
import listActions from './actionCreators/listActionCreator';
import BigAdditionButton from './bigAdditionButton'

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  static dropTarget() {

    function getDomElementDistanceFromMouse(mouseY, cardElement, side) {
      let rect = cardElement.boundedRect
      return Math.abs(rect[side] - mouseY)
    }

    function getDomCardElements(component) {
      let listElement = findDOMNode(component)
      let cardsContainerEle = listElement.getElementsByClassName("cards-container")[0]
      let cardEles = cardsContainerEle.getElementsByClassName("list-card")

      cardEles = Array.prototype.slice.call(cardEles)

      return cardEles.map(e => {
        let element = e.getElementsByClassName("card")[0]
        let boundedRect = element.getBoundingClientRect()

        return {
          cardId: e.getAttribute("data-card-id"),
          element,
          boundedRect
        }})
    }

    function getTopElement(cardElements) {
      return _(cardElements).minBy(e => e.boundedRect.top)
    }

    function getClosestElementToMouse(cardElements, mouseY) {
      let closestElement = _(cardElements).minBy(e => {
        return getDomElementDistanceFromMouse(mouseY, e, 'bottom')
      })
      return closestElement
    }

    function getPreviewMarker(monitor, component) {
      let mouseOffset = monitor.getClientOffset()
      if (!mouseOffset) return;

      let mouseY = mouseOffset.y;
      let domCardElements = getDomCardElements(component)
      let closestElement = getClosestElementToMouse(domCardElements, mouseY)
      let previewMarkerY, previewCardId = closestElement ? closestElement.cardId : "-1"

      if (domCardElements && domCardElements.length > 0) {
        let topElement = getTopElement(domCardElements)

        if (closestElement == topElement) {
          let closestSide = _(['bottom', 'top']).minBy(side => getDomElementDistanceFromMouse(mouseY, topElement, side))
          previewMarkerY = topElement.boundedRect[closestSide]
          previewCardId = closestSide == 'top' ? -1 : previewCardId
        } else {
          previewMarkerY = closestElement.boundedRect.bottom
        }
      } else {
        previewMarkerY = mouseY
      }

      return {
        previewMarkerY,
        previewCardId
      }
    }

    function setPreviewMarker(monitor, component) {
      let { previewCardId, previewMarkerY } = getPreviewMarker(monitor, component)

      component.setState({
        previewCardId,
        previewMarkerY
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
        component.setState({previewMarkerY: null})
      },
    };
  }

  static collect(connect, monitor) {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType()
      };
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

  render() {
    let addCardBtn = (<BigAdditionButton 
                      onClick={ this.onClickAddCardBtn.bind(this) }/>)

    let previewDropMarker = this.props.isOver && this.state.previewMarkerY ?
                                <hr className="preview-card-line"
                                    style={{ top: this.state.previewMarkerY + 'px' }}/> : null
 
    let listTitle = <EditableElement
                     content={ <h3 style={{"textAlign": "center"}}>{this.props.name}</h3> }
                     value={ this.props.name }
                     style={{"textAlign": "center"}}
                     onKeyUp={ this.onListNameKeyUp.bind(this) } />
             
    let cards = this.props.cards.map((c) =>
                              <span key={c} className="list-card" data-card-id={c}>
                                 <Card cardId={c} />
                                <br/>
                              </span>)
    
    return this.props.connectDropTarget(

      <div className="list"
           style={{ background: this.props.color}}>
           
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

    );
  }
}

let dropTarget = DropTarget(props => ["CARD", "LIST"], List.dropTarget(), List.collect)(List)
let connector = connect()(dropTarget);

export default connector;
