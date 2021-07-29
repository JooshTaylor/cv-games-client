import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { useQuery } from '../../../../../shared/hooks/useQuery';
import { LobbyStatus } from '../../../enums/LobbyStatus';
import { TelestrationsRoundType } from '../../../enums/TelestrationsRoundType';
import { Lobby } from '../../../interfaces/Lobby';
import { TelestrationsResult } from '../../../interfaces/TelestrationsResult';

import { TelestrationsViewParams } from '../../../interfaces/TelestrationsViewParams';
import { AccountHelper } from '../../../utils/AccountHelper';

export function TelestrationsResultsView(): JSX.Element {
  const params = useParams<TelestrationsViewParams>();
  const history = useHistory();
  const queryParams = useQuery();

  const playerId = queryParams.get('playerId') ?? AccountHelper.getPlayerForLobby(params.id).id;

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ playerResults, setPlayerResults ] = React.useState<TelestrationsResult>(null as any);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
    onError: () => history.push('/telestrations')
  });

  useFetch<TelestrationsResult>(lobby && {
    url: `/telestrations/lobby/${params.id}/players/${playerId}/results`,
    onSuccess: setPlayerResults
  });

  if (!lobby)
    return <></>;

  if (lobby.status !== LobbyStatus.Complete)
    return <Redirect to={`/telestrations/${lobby.id}`} />;

  if (!playerResults)
    return <></>;

  return (
    <div>
      <h1>Showing results for: {playerResults.player.username}</h1>

      <p className='h6'>Your original word was: {playerResults.word}</p>

      {playerResults.finalRound.roundType === TelestrationsRoundType.DrawWord
        ? (
          <div>
            <p>Here's the final drawing:</p>
            <img alt='' src={playerResults.finalRound.drawing} />
          </div>
        ) : (
          <div>
            <p>The final guess for this word was: {playerResults.finalRound.word}</p>
          </div>
        )
      }
    </div>
  );
}