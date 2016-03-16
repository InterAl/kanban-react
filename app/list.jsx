import React,{Component} from 'react'
import {connect} from 'react-redux'
import Card from './cards.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles/list.css'
import cardActions from './actionCreators/cardActionCreators'
import addCardThunk from './thunks/addCard'
import {DropTarget} from 'react-dnd'
import dragItemContainer from './utils/dragItemContainer'

export class List extends Component {

  constructor(props) {
    super(props);
  }

  static dropTarget() {
    return {
      canDrop(props, monitor) {
        return true
      },

      hover(props, monitor, component) {
       
      },

      drop(props, monitor, component) {
        console.log("dropped");
        let item = monitor.getItem() || dragItemContainer.getDragItem()
        let action = cardActions.moveCard(item.cardId, props.name)
        props.dispatch(action)
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

  onDrop(ev) {
  }

  allowDrop(ev) {
    console.log("allowing drop");
    ev.preventDefault();
  }

  onClickAddCardBtn(ev) {
    this.props.dispatch(addCardThunk(this.props.name))
  }

  render() {
    let addCardBtn = <span className="add-card-btn" onClick={ this.onClickAddCardBtn.bind(this) }><b>+</b></span>

    return this.props.connectDropTarget(
      <div className="list"
           style={{ background: this.props.color}}>

        <h3 style={{"textAlign": "center"}}>{this.props.name}</h3>
        
        <ReactCSSTransitionGroup
          transitionName="card"
          transitionAppear={true} 
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
                                       
            {this.props.cards.map((c) => 
                                        <span key={c}>
                                           <Card cardId={c}/>
                                          <br/>
                                        </span>)}
                                        
        </ReactCSSTransitionGroup>

        {addCardBtn}
     </div>
    );
  }
}

let dropTarget = DropTarget(props => ["CARD", "LIST"], List.dropTarget(), List.collect)(List)
let connector = connect()(dropTarget);

export default connector;
