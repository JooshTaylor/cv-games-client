import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();

  const currentPlayer = AccountHelper.getPlayerForLobby(params.id);

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ word, setWord ] = React.useState<string>();
  const [ round, setRound ] = React.useState<TelestrationsRound>(null as any);
  const [ waitingOn, setWaitingOn ] = React.useState<Account[]>(null as any);
  const [ chain, setChain ] = React.useState<Account[]>(null as any);

  const socket = React.useContext(SocketIoContext);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: lobby => {
      setLobby(lobby);
      setWaitingOn(lobby.players);
    },
    onError: () => navigate('/telestrations')
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
  
  useFetch<Account[]>(lobby && {
    url: `/telestrations/lobby/${lobby.id}/chain`,
    onSuccess: setChain
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

  const receiver = chain?.find((p, i) => {
    let prevInChain: Account;

    if (i === 0) {
      prevInChain = chain[chain.length - 1];
    } else {
      prevInChain = chain[i - 1];
    }

    if (prevInChain.id !== currentPlayer.id)
      return false;

    return true;
  });

  const sender = chain?.find((p, i) => {
    let nextInChain: Account;

    if (i === chain.length - 1) {
      nextInChain = chain[0];
    } else {
      nextInChain = chain[i + 1];
    }

    if (nextInChain.id !== currentPlayer.id)
      return false;

    return true;
  });

  if (!round)
    return <></>;

  if (lobby.status !== LobbyStatus.InProgress)
    return <Navigate to={`/telestrations/${lobby.id}`} />;

  return (
    <div>
      <div>
        <p className='h6'>Chain:</p>
        <div className='d-flex align-items-center pb-3'>
          {chain?.map(p => (
            <React.Fragment key={p.id}>
              <Avatar player={p} />
              <img
                src='https://cdn4.iconfinder.com/data/icons/geomicons/32/672374-chevron-right-512.png'
                alt=''
                style={{ width: '15px', height: '15px', margin: '0 5px' }}
              />
            </React.Fragment>
          )) ?? <></>}

          {!!chain?.length && <Avatar key='last-player-in-chain' player={chain[0]} />}
        </div>
      </div>

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
                return <Navigate to={`/telestrations/${lobby.id}`} />;
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

      {(!!receiver && !!sender) && (
        <div className='pt-3'>
          <p className='h6'>Receiving from: {sender.username}</p>
          <p className='h6'>Sending to: {receiver.username}</p>
        </div>
      )}
    </div>
  );
}