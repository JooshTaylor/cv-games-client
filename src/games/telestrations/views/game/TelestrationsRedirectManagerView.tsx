import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { LobbyStatus } from '../../enums/LobbyStatus';

import { TelestrationsViewParams } from '../../interfaces/TelestrationsViewParams';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { Lobby } from '../../interfaces/Lobby';

export function TelestrationsRedirectManagerView(): JSX.Element {
  const params = useParams<TelestrationsViewParams>();
  const history = useHistory();

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);

  useFetch({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
    onError: () => history.push('/telestrations')
  });

  if (!lobby?.id)
    return <></>;

  switch (lobby.status) {
    case LobbyStatus.WaitingForPlayers:
      return <Redirect to={`/telestrations/${params.id}/lobby`} />
    case LobbyStatus.InProgress:
      return <Redirect to={`/telestrations/${params.id}/play`} />
    case LobbyStatus.Complete:
      return <Redirect to={`/telestrations/${params.id}/results`} />
    default:
      return <Redirect to='/telestrations' />;
  }
}