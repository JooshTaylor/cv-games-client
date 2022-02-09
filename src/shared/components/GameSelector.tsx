import React from 'react';
import { Link } from 'react-router-dom';

export function GameSelector(): JSX.Element {
  return (
    <div>
      <h1>ClickView Games!</h1>

      <h2>Select a game to play:</h2>

      <ul className='list-unstyled'>
        <li>
          <Link to='/telestrations'>Telestrations</Link>
        </li>
        <li>
          <Link to='/wordle'>Wordle Co-op</Link>
        </li>
      </ul>
    </div>
  );
}