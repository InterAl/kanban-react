import React,{Component} from 'react'
import {connect} from 'react-redux'
import Card from './cards.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './styles/list.css'
import cardActions from './actionCreators/cardActionCreators'
import addCardThunk from './thunks/addCard'

export class List extends Component {

  constructor(props) {
    super(props);
  }

  onDrop(ev) {
    console.log("dropped");
    this.props.cardDropped(this.props.name, ev.dataTransfer.getData("text"));
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

    return (
      <div onDrop={this.onDrop.bind(this)}
           onDragOver={this.allowDrop.bind(this)}
           className="list"
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

let connector = connect()(List);

export default connector;
