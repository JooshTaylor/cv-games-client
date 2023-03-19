import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { GameSelector } from './shared/components/GameSelector';

import { TelestrationsRoutes } from './games/telestrations/TelestrationsRoutes';
import { WordleRoutes } from './games/wordle/WordleRoutes';

export function App(): JSX.Element {
  return (
    <div className='container-fluid'>
      <Router>
        <Routes>
          <Route path='/telestrations/*' element={<TelestrationsRoutes />} />

          <Route path='/wordle/*' element={<WordleRoutes />} />

          <Route path='/' element={<GameSelector />} />
        </Routes>
      </Router>
    </div>
  );
}