import React from 'react';
import { TelestrationsResult } from '../../interfaces/TelestrationsResult';

interface ResultsCarouselProps {
  results: TelestrationsResult;
  onClickBack: () => void;
  originalWord: string;
}

export function ResultsCarousel(props: ResultsCarouselProps): JSX.Element {
  const [ currentRoundIndex, setCurrentRoundIndex ] = React.useState(0);

  const currentRound = props.results.rounds[currentRoundIndex];
  const previousRound = currentRoundIndex > 0 ? props.results.rounds[currentRoundIndex - 1] : null;

  function onClickNext(): void {
    if (currentRoundIndex === props.results.rounds.length - 1)
      return;

    setCurrentRoundIndex(i => i + 1);
  }

  function onClickPrevious(): void {
    if (currentRoundIndex < 1)
      return;

    setCurrentRoundIndex(i => i - 1);
  }

  return (
    <div className='mt-3'>
      <p className='h6'>Round number: {currentRoundIndex + 1}</p>

      <div>
        {currentRound.drawing
          ? (
            <>
              <p>{currentRound.player.username} attempted to draw {previousRound?.word ?? props.originalWord}</p>
              <img alt='' src={currentRound.drawing} className='mb-3' />
            </>
          ) : (
            <>
              <p>{currentRound.player.username} then guessed {previousRound?.player.username}'s drawing to be <strong>{currentRound.word}</strong></p>
            </>
          )
        }
      </div>

      <div className='pb-3'>
        <button onClick={onClickPrevious} className='btn btn-primary' disabled={currentRoundIndex < 1}>
          See Previous
        </button>
        <button onClick={onClickNext} className='btn btn-primary mx-2' disabled={currentRoundIndex === props.results.rounds.length - 1}>
          See Next
        </button>
      </div>

      <button onClick={props.onClickBack} className='btn btn-secondary'>
        Back to results home
      </button>
    </div>
  );
}