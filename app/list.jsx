import React,{Component} from 'react'
import Card from './cards.jsx'

export default class List extends Component {

  constructor(props) {
    super(props);
  }

  onDrop(ev) {
    console.log("dropped");
    this.props.cardDropped(this, ev.dataTransfer.getData("text"));
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
        {this.props.cards.map((c) => 
                                    <span key={c.id}>
                                      <Card card={c}/>
                                      <br/>
                                    </span>)}
     </div>
    );
  }
}
