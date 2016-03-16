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

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  static dropTarget() {

    function setPreviewMarker(monitor, component) {
      if (!monitor.getClientOffset()) return;

      let mouseY = monitor.getClientOffset().y;
      let listElement = findDOMNode(component)
      let cardsContainerEle = listElement.getElementsByClassName("cards-container")[0]
      let cardEles = cardsContainerEle.getElementsByClassName("list-card")

      cardEles = Array.prototype.slice.call(cardEles)

      let cardMap = cardEles.reduce((p, c) => {
        let cardId = c.getAttribute("data-card-id")
        let element = c.getElementsByClassName("card")[0]
        p[cardId] = element
        return p
      }, {})

      let closestComponentKey = _(cardMap).map((v, k) => k).minBy(cardId => {
        let element = cardMap[cardId]

        if (!element) 
          return Infinity

        return Math.abs(element.getBoundingClientRect().bottom - mouseY)
      })

      let closestComponent = cardMap[closestComponentKey]

      if (closestComponent) {
        let previewMarkerY = findDOMNode(closestComponent).getBoundingClientRect().bottom
        component.setState({
          previewMarkerY,
          previewCardId: Number(closestComponentKey)
        }) 
      }
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
        let action = cardActions.moveCard(item.cardId, props.name, dropLocationIdx)
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
    this.props.dispatch(addCardThunk(this.props.name))
  }


  render() {
    let addCardBtn = <span className="add-card-btn" onClick={ this.onClickAddCardBtn.bind(this) }><b>+</b></span>
    let previewDropMarker = this.props.isOver && this.state.previewMarkerY ?
                              <hr className="preview-card-line" style={{ top: this.state.previewMarkerY + 'px' }}/> 
                            : null
    let listTitle = <h3 style={{"textAlign": "center"}}>{this.props.name}</h3>
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

          <ReactCSSTransitionGroup transitionName="card" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={300} transitionLeaveTimeout={300}> 

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
