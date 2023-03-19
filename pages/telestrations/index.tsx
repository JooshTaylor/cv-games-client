import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'

import { useFetch } from '@/shared/hooks/useFetch';
import { axiosFetch } from '@/shared/utils/axiosFetch';
import { Lobby } from '@/games/telestrations/interfaces/Lobby';

export default function TelestrationsHomeView(): JSX.Element {
  const router = useRouter();

  const [ newLobbyName, setNewLobbyName ] = React.useState('');
  const [ lobbies, setLobbies ] = React.useState<Lobby[]>([]);

  useFetch<Lobby[]>({
    url: '/telestrations/lobby',
    onSuccess: setLobbies
  });

  function onClickCreateLobby(): void {
    if (!newLobbyName)
      return;

    axiosFetch<Lobby>({
      url: '/telestrations/lobby',
      method: 'post',
      body: { name: newLobbyName },
      onSuccess: lobby => router.push(`/telestrations/${lobby.id}/lobby`)
    });
  }

  return (
    <div>
      <h1>Telestrations</h1>

      <div className='row'>
        <div className='col-6'>
          <h2 className='h5'>Start a new lobby</h2>

          <input
            className='form-control d-block mb-1'
            placeholder='Enter your lobby name'
            value={newLobbyName}
            onChange={e => setNewLobbyName(e.target.value)}
          />

          <button className='btn btn-primary' onClick={onClickCreateLobby} disabled={!newLobbyName}>Create Lobby</button>
        </div>

        <div className='col-6'>
          {!!lobbies?.length && (
            <>
              <h2 className='h5'>Join a game</h2>

              {lobbies.map(l => (
                <div key={l.id}>
                  <Link href={`/telestrations/${l.id}/lobby`}>{l.name}</Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}