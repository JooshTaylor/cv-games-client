import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { GameSelector } from './shared/components/GameSelector';

import { TelestrationsRoutes } from './games/telestrations/TelestrationsRoutes';
import { WordleRoutes } from './games/wordle/WordleRoutes';

export function App(): JSX.Element {
  return (
    <div className='container-fluid'>
      <Router>
        <Switch>
          <Route path='/telestrations'>
            <TelestrationsRoutes />
          </Route>

          <Route path='/wordle'>
            <WordleRoutes />
          </Route>

          <Route path='/'>
            <GameSelector />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}