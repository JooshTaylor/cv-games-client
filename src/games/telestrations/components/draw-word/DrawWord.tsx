import React from 'react';
import { TelestrationsRound } from '../../interfaces/TelestrationsRound';

interface DrawWordProps {
  round: TelestrationsRound;
}

export function DrawWord(props: DrawWordProps): JSX.Element {
  
  return (
    <>
      <h2>Draw word: {props.round.word}</h2>
    </>
  );
}