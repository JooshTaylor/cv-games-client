import React from 'react';
import Link from 'next/link';

export function GameSelector(): JSX.Element {
  return (
    <div>
      <h1>ClickView Games!</h1>

      <h2>Select a game to play:</h2>

      <ul className='list-unstyled'>
        <li>
          <Link href='/telestrations'>Telestrations</Link>
        </li>
        <li>
          <Link href='/wordle'>Wordle Co-op</Link>
        </li>
      </ul>
    </div>
  );
}