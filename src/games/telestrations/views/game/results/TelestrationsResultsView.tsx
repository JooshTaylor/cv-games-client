import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { useQuery } from '../../../../../shared/hooks/useQuery';
import { ResultsCarousel } from '../../../components/result-carousel/ResultsCarousel';
import { ResultsLinks } from '../../../components/results-links/ResultsLinks';
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

  const [ showCarousel, setShowCarousel ] = React.useState(false);
  const [ viewPlayerList, setViewPlayerList ] = React.useState(false);

  React.useEffect(() => {
    setShowCarousel(false);
    setViewPlayerList(false);
  }, [playerId]);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
    onError: () => history.push('/telestrations')
  });

  useFetch<TelestrationsResult>(lobby && {
    url: `/telestrations/lobby/${params.id}/players/${playerId}/results`,
    onSuccess: setPlayerResults
  });

  function onClickViewChain(): void {
    setShowCarousel(true);
  }

  function onClickViewOtherPlayers(): void {
    setViewPlayerList(true);
  }

  if (!lobby)
    return <></>;

  if (lobby.status !== LobbyStatus.Complete)
    return <Redirect to={`/telestrations/${lobby.id}`} />;

  if (!playerResults)
    return <></>;

  const finalResult = playerResults.rounds[playerResults.rounds.length - 1];

  return (
    <div>
      <h1>Showing results for: {playerResults.player.username}</h1>

      <p className='h5'>{playerResults.player.username}'s original word was: {playerResults.word}</p>

      {(() => {
        if (showCarousel) {
          return (
            <ResultsCarousel
              results={playerResults}
              onClickBack={() => setShowCarousel(false)}
              originalWord={playerResults.word}
            />
          );
        }

        if (viewPlayerList) {
          return <ResultsLinks lobby={lobby} currentPlayerId={playerId} onClickBack={() => setViewPlayerList(false)} />;
        }

        return (
          <>
            {finalResult.drawing
              ? (
                <div>
                  <p>Here's the final drawing, created by {finalResult.player.username}:</p>
                  <img alt='' src={finalResult.drawing} className='mb-3' />
                </div>
              ) : (
                <div>
                  <p>The final guess for this word was <strong>{finalResult.word}</strong>, guessed by {finalResult.player.username}</p>
                </div>
              )
            }

            <div>
              <button className='btn btn-primary' onClick={onClickViewChain}>See how it got here</button>
              <button className='btn btn-secondary mx-2' onClick={onClickViewOtherPlayers}>View other player's results</button>
              <button className='btn btn-secondary mx-2' onClick={() => history.push('/telestrations')}>Back to home</button>
            </div>
          </>
        );
      })()}
    </div>
  );
}