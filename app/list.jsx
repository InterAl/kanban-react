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
      let listElement = findDOMNode(component)
      let cardsContainerEle = listElement.getElementsByClassName("cards-container")[0]
      let cardEles = cardsContainerEle.getElementsByClassName("card")
      let mouseY = monitor.getClientOffset().y;
      let closestComponent = _(cardEles).minBy(element => {
        if (!element) 
          return Infinity

        return Math.abs(element.getBoundingClientRect().bottom - mouseY)
      })

      if(closestComponent) {
        let previewMarkerY = findDOMNode(closestComponent).getBoundingClientRect().bottom
        component.setState({previewMarkerY}) 
      }
    }

    function getDraggedItem(monitor) {
        let item = monitor.getItem() || dragItemContainer.getDragItem()
        return item
    }

    return {
      canDrop(props, monitor) {
        let item = getDraggedItem(monitor)
        return props.cards.indexOf(item.cardId) === -1
      },

      hover(props, monitor, component) {
        setPreviewMarker(monitor, component)
      },

      drop(props, monitor, component) {
        console.log("dropped");
        let item = getDraggedItem(monitor)
        let action = cardActions.moveCard(item.cardId, props.name)
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
    
    return this.props.connectDropTarget(
      <div className="list"
        style={{ background: this.props.color}}
      >

        <h3 style={{"textAlign": "center"}}>{this.props.name}</h3>
        {previewDropMarker}
        <div className="cards-container">
          <ReactCSSTransitionGroup
            transitionName="card"
            transitionAppear={true} 
            transitionAppearTimeout={500}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
                                         
              {this.props.cards.map((c) => 
                                          <span key={c}>
                                             <Card cardId={c} />
                                            <br/>
                                          </span>)}
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
