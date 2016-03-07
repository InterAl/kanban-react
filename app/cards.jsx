import React, {Component} from 'react'
import Tasks from './tasks'

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
    const style = {position: "relative", overflow: "auto", "width": "auto", "display": "inline-block", "background": "white", "margin": "10px", "padding": "15px 15px 15px 10px", boxShadow: "5px 5px 5px  rgba(0, 0, 0, 0.25)"};

    return (
      <div draggable="true" onDragStart={this.onDrag.bind(this)} style={style}>
        <div style={{"position": "absolute", "left": "0px", top: 0, bottom: 0,  "backgroundColor": "red", "width": "7px", zIndex: 1}}></div>
        <b>{card.title}</b><br/>
        <span onClick={this.toggleDescription.bind(this)} style={{cursor: 'pointer'}}>{"+\u00a0"}</span>
        <span style={{ display: this.state.showDescription ? 'inline-block' : 'none'  }}> { card.description }</span>
        <Tasks key={card.id} tasks={card.tasks} />
      </div>
    );
  }
}
