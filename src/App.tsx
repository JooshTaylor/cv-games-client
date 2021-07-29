import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { TelestrationsRoutes } from './games/telestrations/TelestrationsRoutes';

export function App(): JSX.Element {
  return (
    <div className='container-fluid'>
      <Router>
        <Switch>
          <Route path='/telestrations'>
            <TelestrationsRoutes />
          </Route>
          {/* TODO: Update to show a game selector view when there are more games than just telestrations */}
          <Route path='/'>
            <TelestrationsRoutes />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}