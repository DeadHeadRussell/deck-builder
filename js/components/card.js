import React from 'react';

export default class Card extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.flip = this.flip.bind(this);
    this.unflip = this.unflip.bind(this);

    this.state = {flipped: false};
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.card);
    }
  }

  flip() {
    this.setState({flipped: true});
  }

  unflip() {
    this.setState({flipped: false});
  }

  render() {
    let name = (this.state.flipped && this.props.card.flip) ?
      this.props.card.flip :
      this.props.card.name;

    return (
      <div className={`card ${this.props.card.rarity}`} onClick={this.onClick} onMouseOver={this.flip} onMouseOut={this.unflip}>
        <p className='card-name'>{name}</p>
        <p className='card-rarity'>{this.props.card.rarity}</p>
        <img className='card-image' src={`/images/${name}.png`} />
      </div>
    );
  }
}

