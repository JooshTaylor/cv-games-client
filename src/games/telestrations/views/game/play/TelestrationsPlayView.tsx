import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { SocketIoContext } from '../../../../../shared/contexts/SocketIoContext';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { axiosFetch } from '../../../../../shared/utils/axiosFetch';
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

  const socket = React.useContext(SocketIoContext);

  useFetch<Lobby>({
    url: `/telestrations/lobby/${params.id}`,
    onSuccess: setLobby,
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

    return () => {
      socket.off(TelestrationsEvents.UPDATE_LOBBY);
    };
  }, [socket]);

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

  if (!round)
    return <></>;

  if (lobby.status !== LobbyStatus.InProgress)
    return <Redirect to={`/telestrations/${lobby.id}`} />;

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
      return <GuessWord round={round} />;
    }

    default: {
      return <Redirect to={`/telestrations/${lobby.id}`} />;
    }
  }
}