import React, {Component} from 'react'
import cards from './cardsData'
import List from './list'

export default class Board extends Component {
  constructor () {
    super();
    
    this.state = {
      lists: [
        {name: "Backlog", color: '#CFCBF5', cards: []},
        {name: "In Progress", color: '#D1F5CB', cards: []},
        {name: "Done", color: '#F5F4CB', cards: []}
      ]
    };

    this.state.lists[0].cards = cards;
  }

  onCardDropped(list, cardId) {
    const card = cards.find(c => c.id == cardId);
    this.state.lists.forEach(l => l.cards = l.cards.filter(c => c.id != cardId)); 
    this.state.lists.find(l => l.name == list.props.name).cards.push(card);
    this.setState(this.state);
  }

  render () {
    const lists = this.state.lists.map(l => 
          <List key={l.name} cardDropped={this.onCardDropped.bind(this)} name={l.name} cards={l.cards} color={l.color} />
      );
        
    return (
      <div>
          {lists}
      </div>
    );
  }
}
