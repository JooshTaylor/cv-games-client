import React from 'react';
import { TelestrationsResult } from '../../interfaces/TelestrationsResult';

interface ResultsCarouselProps {
  results: TelestrationsResult;
  onClickBack: () => void;
}

export function ResultsCarousel(props: ResultsCarouselProps): JSX.Element {
  console.log('props', props);

  return (
    <div>
      <button onClick={props.onClickBack} className='btn btn-primary'>
        Go Back
      </button>
    </div>
  );
}