import React from 'react';

export default class Table extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='table'>
        {this.props.players.map(player => (
          <p key={player.name} className='table-player'>
            <span className='table-player-name'>{player.name}</span>
            <span className='table-player-status'>-</span>
            <span className='table-player-status'>{'Waiting: ' + player.cardPicked}</span>
            <span className='table-player-status'>{'Online: ' + !player.dc}</span>
          </p>
        ))}
      </div>
    );
  }
}

