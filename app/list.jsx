import React,{Component} from 'react'
import {connect} from 'react-redux'
import Card from './cards.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class List extends Component {

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

  render() {
    return (
      <div onDrop={this.onDrop.bind(this)}
           onDragOver={this.allowDrop.bind(this)}
           style={{display: 'inline-block', background: this.props.color, marginRight: '30px', minHeight: '500px', minWidth: '300px', verticalAlign: 'top'}}>

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
     </div>
    );
  }
}

let connector = connect()(List);

export default connector;
