import Link from 'next/link';
import React from 'react';
import { Lobby } from '../../interfaces/Lobby';

interface ResultsLinksProps {
  lobby: Lobby;
  currentPlayerId: string;
  onClickBack: () => void;
}

export function ResultsLinks(props: ResultsLinksProps): JSX.Element {
  return (
    <div>
      <ul className='list-unstyled'>
        {props.lobby.players.filter(p => p.id !== props.currentPlayerId).map(p => (
          <li key={p.id}>
            <Link href={`/telestrations/${props.lobby.id}/results?playerId=${p.id}`}>
              {p.username}
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={props.onClickBack} className='btn btn-primary'>
        Go Back
      </button>
    </div>
  );
}