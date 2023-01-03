import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { LobbyStatus } from '../../enums/LobbyStatus';

import { TelestrationsViewParams } from '../../interfaces/TelestrationsViewParams';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { Lobby } from '../../interfaces/Lobby';

export function TelestrationsRedirectManagerView(): JSX.Element {
  const params = useParams<TelestrationsViewParams>();
  const navigate = useNavigate();

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);

  useFetch({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
    onError: () => navigate('/telestrations')
  });

  if (!lobby?.id)
    return <></>;

  switch (lobby.status) {
    case LobbyStatus.WaitingForPlayers:
      return <Navigate to={`/telestrations/${params.id}/lobby`} />
    case LobbyStatus.InProgress:
      return <Navigate to={`/telestrations/${params.id}/play`} />
    case LobbyStatus.Complete:
      return <Navigate to={`/telestrations/${params.id}/results`} />
    default:
      return <Navigate to='/telestrations' />;
  }
}