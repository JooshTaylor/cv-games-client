import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { SocketIoContext } from '../../../../../shared/contexts/SocketIoContext';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { Account } from '../../../../../shared/interfaces/Account';
import { axiosFetch } from '../../../../../shared/utils/axiosFetch';
import { Avatar } from '../../../components/avatar/Avatar';
import { DrawWord } from '../../../components/draw-word/DrawWord';
import { GuessWord } from '../../../components/guess-word/GuessWord';
import { SelectWord } from '../../../components/select-word/SelectWord';
import { TelestrationsEvents } from '../../../constants/TelestrationsEvents';
import { LobbyStatus } from '../../../enums/LobbyStatus';
import { TelestrationsRoundType } from '../../../enums/TelestrationsRoundType';
import { Lobby } from '../../../interfaces/Lobby';
import { TelestrationsRound } from '../../../interfaces/TelestrationsRound';

import { TelestrationsViewParams } from '../../../interfaces/TelestrationsViewParams';
import { AccountHelper } from '../../../utils/AccountHelper';

export function TelestrationsPlayView(): JSX.Element {
  const params = useParams<TelestrationsViewParams>();
  const history = useHistory();

  const currentPlayer = AccountHelper.getPlayerForLobby(params.id);

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ word, setWord ] = React.useState<string>();
  const [ round, setRound ] = React.useState<TelestrationsRound>(null as any);
  const [ waitingOn, setWaitingOn ] = React.useState<Account[]>(null as any);

  const socket = React.useContext(SocketIoContext);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: lobby => {
      setLobby(lobby);
      setWaitingOn(lobby.players);
    },
    onError: () => history.push('/telestrations')
  });

  useFetch<string>({
    url: `/telestrations/lobby/${params.id}/players/${currentPlayer.id}/word`,
    onSuccess: setWord,
    onError: () => setWord('')
  });

  useFetch<TelestrationsRound>(lobby && {
    url: `/telestrations/lobby/${lobby.id}/round/${lobby.currentRound}?playerId=${currentPlayer.id}`,
    onSuccess: setRound
  });

  React.useEffect(() => {
    if (!socket.id)
      return;

    socket.on(TelestrationsEvents.UPDATE_LOBBY, setLobby);
    socket.on(TelestrationsEvents.WAITING_ON, setWaitingOn);

    return () => {
      socket.off(TelestrationsEvents.UPDATE_LOBBY);
      socket.off(TelestrationsEvents.WAITING_ON);
    };
  }, [socket]);

  React.useEffect(() => {
    if (!round?.roundNumber || !lobby?.players)
      return;

    setWaitingOn(lobby.players);
  }, [round?.roundNumber]);

  function onSelectWord(word: string): void {
    setWord(word);

    axiosFetch({
      url: `/telestrations/lobby/${params.id}/players/${currentPlayer.id}/word`,
      method: 'post',
      body: { word }
    });
  }

  function onSubmitDrawing(drawingImageUrl: string): void {
    axiosFetch({
      url: `/telestrations/lobby/${params.id}/players/${currentPlayer.id}/round/${lobby.currentRound}/drawing`,
      method: 'post',
      body: { drawing: drawingImageUrl }
    });
  }

  function onGuessWord(guess: string): void {
    axiosFetch({
      url: `/telestrations/lobby/${params.id}/players/${currentPlayer.id}/round/${lobby.currentRound}/guess`,
      method: 'post',
      body: { guess }
    });
  }

  if (!round)
    return <></>;

  if (lobby.status !== LobbyStatus.InProgress)
    return <Redirect to={`/telestrations/${lobby.id}`} />;

  return (
    <div className='row'>
      <div className='col-8'>
        {(() => {
          switch (round.roundType) {
            case TelestrationsRoundType.SelectWord: {
              if (word === undefined)
                return <></>;
        
              return <SelectWord onSelectWord={onSelectWord} selectedWord={word} />;
            }
        
            case TelestrationsRoundType.DrawWord: {
              return <DrawWord round={round} onSubmitDrawing={onSubmitDrawing} />;
            }
        
            case TelestrationsRoundType.GuessWord: {
              return <GuessWord round={round} onGuessWord={onGuessWord} />;
            }
        
            default: {
              return <Redirect to={`/telestrations/${lobby.id}`} />;
            }
          }
        })()}
      </div>

      {!!waitingOn?.length && (
        <div className='col-4'>
          <p className='h6'>Waiting on:</p>

          <div className='d-flex align-items-center flex-wrap'>
            {waitingOn.map(p => (
              <div key={p.username} className='mx-2'>
                <Avatar player={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}