import React, {Component} from 'react'
import Tasks from './tasks'
import './styles/card.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Card extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDescription: true
    };
  }

  toggleDescription () {
    this.setState({showDescription: !this.state.showDescription});
  }

  onDrag (ev) {
    console.log("dragging");
    ev.dataTransfer.setData('text', this.props.card.id);
  }

  render() {
    const card = this.props.card;
    let cardDescription = this.state.showDescription ? <span>{ card.description }</span> : null;
    
    return (
      <div draggable="true" onDragStart={this.onDrag.bind(this)} className="card">
          <div className="card-ribbon"></div>
          <span onClick={this.toggleDescription.bind(this)} style={{cursor: 'pointer'}}>{"+\u00a0"}</span>
          <b>{card.title}</b>
          <br/>

          <ReactCSSTransitionGroup
            transitionName="card"
            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}>
            { cardDescription }
          </ReactCSSTransitionGroup>

          <Tasks key={card.id} tasks={card.tasks} />
      </div>
    );
  }
}
