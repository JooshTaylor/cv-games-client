import React from 'react';

interface SelectWordProps {
  selectedWord: string;
  onSelectWord: (word: string) => void;
}

export function SelectWord(props: SelectWordProps): JSX.Element {
  const [ lockForm, setLockForm ] = React.useState(!!props.selectedWord);
  const [ word, setWord ] = React.useState(props.selectedWord);

  function onSubmit(e: React.FormEvent): void {
    e.preventDefault();

    setLockForm(true);

    props.onSelectWord(word);
  }

  return (
    <div>
      <h1>
        {lockForm
          ? <>Your word is "{word}"! Waiting for other players...</>
          : <>Select your word</>
        }
      </h1>

      <form onSubmit={onSubmit}>
        <div className='form-group pb-3'>
          <input
            className='form-control'
            placeholder='Enter your word...'
            value={word}
            onChange={e => setWord(e.target.value)}
            disabled={lockForm}
          />
        </div>

        <div className='form-group'>
          <button type='submit' className='btn btn-primary' disabled={lockForm}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}