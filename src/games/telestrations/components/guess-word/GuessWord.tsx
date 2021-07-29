import React from 'react';
import { TelestrationsRound } from '../../interfaces/TelestrationsRound';

interface GuessWordProps {
  round: TelestrationsRound;
}

export function GuessWord(props: GuessWordProps): JSX.Element {
  return (
    <>
      <h2>Guess word: {props.round.imageUrl}</h2>
    </>
  );
}