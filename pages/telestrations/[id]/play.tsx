import React from 'react';
import { useRouter } from 'next/router';

import { Avatar } from '@/games/telestrations/components/avatar/Avatar';
import { DrawWord } from '@/games/telestrations/components/draw-word/DrawWord';
import { GuessWord } from '@/games/telestrations/components/guess-word/GuessWord';
import { SelectWord } from '@/games/telestrations/components/select-word/SelectWord';
import { TelestrationsEvents } from '@/games/telestrations/constants/TelestrationsEvents';
import { LobbyStatus } from '@/games/telestrations/enums/LobbyStatus';
import { TelestrationsRoundType } from '@/games/telestrations/enums/TelestrationsRoundType';
import { Lobby } from '@/games/telestrations/interfaces/Lobby';
import { TelestrationsRound } from '@/games/telestrations/interfaces/TelestrationsRound';
import { SocketIoContext } from '@/shared/contexts/SocketIoContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { Account } from '@/shared/interfaces/Account';
import { axiosFetch } from '@/shared/utils/axiosFetch';
import { useAccounts } from '@/games/telestrations/hooks/useAccounts';

export default function TelestrationsPlayView(): JSX.Element {
  const router = useRouter();

  const accounts = useAccounts();
  const currentPlayer = accounts.getPlayerForLobby(router.query.id);

  const [ lobby, setLobby ] = React.useState<Lobby>(null as any);
  const [ word, setWord ] = React.useState<string>();
  const [ round, setRound ] = React.useState<TelestrationsRound>(null as any);
  const [ waitingOn, setWaitingOn ] = React.useState<Account[]>(null as any);
  const [ chain, setChain ] = React.useState<Account[]>(null as any);

  const socket = React.useContext(SocketIoContext);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${router.query.id}`,
    onSuccess: lobby => {
      setLobby(lobby);
      setWaitingOn(lobby.players);
    },
    onError: () => router.push('/telestrations')
  });

  useFetch<string>({
    url: `/telestrations/lobby/${router.query.id}/players/${currentPlayer.id}/word`,
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

  React.useEffect(() => {
    if (!lobby || lobby.status === LobbyStatus.InProgress)
      return;

    router.replace(`/telestrations/${lobby.id}`);
  }, [lobby?.status]);

  function onSelectWord(word: string): void {
    setWord(word);

    axiosFetch({
      url: `/telestrations/lobby/${router.query.id}/players/${currentPlayer.id}/word`,
      method: 'post',
      body: { word }
    });
  }

  function onSubmitDrawing(drawingImageUrl: string): void {
    axiosFetch({
      url: `/telestrations/lobby/${router.query.id}/players/${currentPlayer.id}/round/${lobby.currentRound}/drawing`,
      method: 'post',
      body: { drawing: drawingImageUrl }
    });
  }

  function onGuessWord(guess: string): void {
    axiosFetch({
      url: `/telestrations/lobby/${router.query.id}/players/${currentPlayer.id}/round/${lobby.currentRound}/guess`,
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
                return <>Something went wrong</>;
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