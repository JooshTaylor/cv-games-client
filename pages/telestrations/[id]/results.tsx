import React from 'react';
import { useRouter } from 'next/router';

import { ResultsCarousel } from '@/games/telestrations/components/result-carousel/ResultsCarousel';
import { ResultsLinks } from '@/games/telestrations/components/results-links/ResultsLinks';
import { LobbyStatus } from '@/games/telestrations/enums/LobbyStatus';
import { Lobby } from '@/games/telestrations/interfaces/Lobby';
import { TelestrationsResult } from '@/games/telestrations/interfaces/TelestrationsResult';
import { AccountHelper } from '@/games/telestrations/utils/AccountHelper';
import { useFetch } from '@/shared/hooks/useFetch';
import { useParam } from '@/shared/hooks/useParam';

export default function TelestrationsResultsView(): JSX.Element {
  const router = useRouter();
  const lobbyId = useParam('id');
  const playerId = useParam('playerId', () => AccountHelper.getPlayerForLobby(lobbyId).id);

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ playerResults, setPlayerResults ] = React.useState<TelestrationsResult>(null as any);

  const [ showCarousel, setShowCarousel ] = React.useState(false);
  const [ viewPlayerList, setViewPlayerList ] = React.useState(false);

  React.useEffect(() => {
    setShowCarousel(false);
    setViewPlayerList(false);
  }, [playerId]);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${lobbyId}`,
    onSuccess: setLobby,
    onError: () => router.replace('/telestrations')
  });

  useFetch<TelestrationsResult>(lobby && {
    url: `/telestrations/lobby/${lobbyId}/players/${playerId}/results`,
    onSuccess: setPlayerResults
  });

  React.useEffect(() => {
    if (!lobby || lobby.status === LobbyStatus.Complete)
      return;

    router.replace(`/telestrations/${lobby.id}`);
  }, [lobby?.status]);

  function onClickViewChain(): void {
    setShowCarousel(true);
  }

  function onClickViewOtherPlayers(): void {
    setViewPlayerList(true);
  }

  if (!lobby)
    return <></>;

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
              <button className='btn btn-primary' onClick={onClickViewChain}>
                See how it got here
              </button>
              <button className='btn btn-secondary mx-2' onClick={onClickViewOtherPlayers}>
                View other player's results
              </button>
              <button className='btn btn-secondary mx-2' onClick={() => router.push('/telestrations')}>
                Back to home
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
}