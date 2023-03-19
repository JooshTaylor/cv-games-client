import React from 'react';
import { useRouter } from 'next/router';

import { Avatar } from '@/games/telestrations/components/avatar/Avatar';
import { TelestrationsEvents } from '@/games/telestrations/constants/TelestrationsEvents';
import { LobbyStatus } from '@/games/telestrations/enums/LobbyStatus';
import { Lobby } from '@/games/telestrations/interfaces/Lobby';
import { AccountHelper } from '@/games/telestrations/utils/AccountHelper';
import { SocketIoContext } from '@/shared/contexts/SocketIoContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { Account } from '@/shared/interfaces/Account';
import { axiosFetch } from '@/shared/utils/axiosFetch';

export default function TelestrationsLobbyView(): JSX.Element {
  const router = useRouter();

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ accounts, setAccounts ] = React.useState<Account[]>(null as any);
  const [ disableStartButton, setDisableStartButton ] = React.useState(false);

  const socket = React.useContext(SocketIoContext);
  
  const selectedPlayer = AccountHelper.getPlayerForLobby(lobby?.id);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${router.query.id}`,
    onSuccess: setLobby,
    onError: () => router.push('/telestrations')
  });

  useFetch<Account[]>({
    url: `/accounts`,
    onSuccess: setAccounts
  });

  const availablePlayers = accounts?.filter(acc => !lobby?.players?.find(_acc => _acc.id === acc.id)) ?? [];

  const emitEventToLobby = (eventName: string, ...args: any[]) => {
    if (!lobby)
      return;

    socket.emit(eventName, lobby.id, ...args);
  }

  React.useEffect(() => {
    if (!socket.id)
      return;

    socket.on(TelestrationsEvents.STARTING_GAME, () => setDisableStartButton(true));
    socket.on(TelestrationsEvents.UPDATE_LOBBY, setLobby);

    return () => {
      socket.off(TelestrationsEvents.STARTING_GAME);
      socket.off(TelestrationsEvents.UPDATE_LOBBY);
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket.id || !lobby?.id)
      return;

    socket.emit(TelestrationsEvents.JOIN_LOBBY, lobby.id);

    socket.on(TelestrationsEvents.START_GAME, () => {
      router.push(`/telestrations/${lobby.id}/play`);
    });

    return () => {
      socket.off(TelestrationsEvents.START_GAME);
    };
  }, [ socket, lobby?.id ]);

  React.useEffect(() => {
    if (!lobby || lobby.status === LobbyStatus.WaitingForPlayers)
      return;

    router.replace(`/telestrations/${lobby.id}`);
  }, [lobby?.status]);

  function selectPlayer(player: Account): void {
    const body = [player];

    if (selectedPlayer)
      body.push(selectedPlayer);

    AccountHelper.setPlayerForLobby(lobby.id, player);

    updatePlayers(body);
  }

  function deselectPlayer(player: Account): void {
    if (!selectedPlayer || selectedPlayer.id !== player.id)
      return;

    AccountHelper.clearPlayer(lobby.id);

    updatePlayers([player]);
  }

  function updatePlayers(body: Account[]): void {
    axiosFetch({
      url: `/telestrations/lobby/${lobby.id}/players`,
      method: 'put',
      body,
      onSuccess: (lobby) => {
        setLobby(lobby);
        emitEventToLobby(TelestrationsEvents.UPDATE_LOBBY);
      }
    });
  }

  function onClickStartGame(): void {
    if (!lobby)
      return;

    emitEventToLobby(TelestrationsEvents.STARTING_GAME);

    axiosFetch({
      url: `/telestrations/lobby/${lobby.id}/start`,
      method: 'post'
    });
  }

  if (!lobby || !accounts)
    return <></>;

  return (
    <div>
      <h1>Waiting Room</h1>

      {!!selectedPlayer && (
        <div className='pb-3'>
          <h2 className='h5'>You have selected:</h2>
          <div style={{ width: '50px' }}>
            <Avatar player={selectedPlayer} />
          </div>
        </div>
      )}

      <div className='row'>
        <div className='col-6'>
          <h2 className='h6'>Select an account</h2>

          <ul className='list-unstyled d-flex align-items-center flex-wrap'>
            {availablePlayers.map(player => (
              <li key={player.id}>
                <button className='btn btn-link text-decoration-none' onClick={() => selectPlayer(player)}>
                  <Avatar player={player} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className='col-6'>
          <h2 className='h6'>Players</h2>

          <ul className='list-unstyled d-flex align-items-center flex-wrap'>
            {lobby.players.map(player => (
              <li key={player.id}>
                <button className='btn btn-link text-decoration-none' onClick={() => deselectPlayer(player)}>
                  <Avatar player={player} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(selectedPlayer?.username === 'joosh' && lobby.players.length > 2) && (
        <div>
          <button onClick={onClickStartGame} className='btn btn-primary' disabled={disableStartButton}>
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}