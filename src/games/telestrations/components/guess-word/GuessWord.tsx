import React from 'react';
import { TelestrationsRound } from '../../interfaces/TelestrationsRound';

interface GuessWordProps {
  round: TelestrationsRound;
  onGuessWord: (guess: string) => void;
}

export function GuessWord(props: GuessWordProps): JSX.Element {
  const [ lockForm, setLockForm ] = React.useState(!!props.round.word);
  const [ guess, setGuess ] = React.useState(props.round.word ?? '');

  function onSubmit(e: React.FormEvent): void {
    e.preventDefault();

    setLockForm(true);
    props.onGuessWord(guess);
  }

  return (
    <>
      <h2>
        {lockForm
          ? <>Guess submitted! Waiting for other players...</>
          : <>Guess the title of this drawing!</>
        }
      </h2>

      <img alt='' src={props.round.drawing} style={{ width: '600px', height: '600px' }} />

      <form onSubmit={onSubmit}>
        <div className='form-group pb-3'>
          <input
            className='form-control'
            placeholder='Enter your guess here...'
            value={guess}
            onChange={e => setGuess(e.target.value)}
            disabled={lockForm}
          />
        </div>

        <div className='form-group'>
          <button className='btn btn-primary' type='submit' disabled={lockForm}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
}