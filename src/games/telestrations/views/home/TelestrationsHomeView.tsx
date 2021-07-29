import React from 'react';
import { useHistory } from 'react-router-dom';

import { axiosFetch } from '../../../../shared/utils/axiosFetch';
import { Lobby } from '../../interfaces/Lobby';

export function TelestrationsHomeView(): JSX.Element {
  const history = useHistory();

  function onClickCreateLobby(): void {
    axiosFetch<Lobby>({
      url: '/telestrations/lobby',
      method: 'post',
      onSuccess: lobby => history.push(`/telestrations/${lobby.id}/lobby`)
    });
  }

  return (
    <div>
      <h1>Telestrations</h1>

      <div className='row'>
        <div className='col-6'>
          <h2 className='h5'>Start a new lobby</h2>

          <button className='btn btn-primary' onClick={onClickCreateLobby}>Create Lobby</button>
        </div>

        <div className='col-6'>
          <h2 className='h5'>Join a game</h2>
        </div>
      </div>
    </div>
  );
}