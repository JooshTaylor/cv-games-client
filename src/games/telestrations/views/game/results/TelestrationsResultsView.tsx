import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { LobbyStatus } from '../../../enums/LobbyStatus';
import { Lobby } from '../../../interfaces/Lobby';

import { TelestrationsViewParams } from '../../../interfaces/TelestrationsViewParams';

export function TelestrationsResultsView(): JSX.Element {
  const params = useParams<TelestrationsViewParams>();
  const history = useHistory();

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
    onError: () => history.push('/telestrations')
  });

  if (!lobby)
    return <></>;

  if (lobby.status !== LobbyStatus.Complete)
    return <Redirect to={`/telestrations/${lobby.id}`} />;

  return (
    <>Results for lobby {params.id}</>
  );
}