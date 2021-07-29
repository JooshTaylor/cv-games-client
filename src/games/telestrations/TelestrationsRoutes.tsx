import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { TelestrationsRedirectManagerView } from './views/game/TelestrationsRedirectManagerView';
import { TelestrationsLobbyView } from './views/game/lobby/TelestrationsLobbyView';
import { TelestrationsPlayView } from './views/game/play/TelestrationsPlayView';
import { TelestrationsResultsView } from './views/game/results/TelestrationsResultsView';
import { TelestrationsHomeView } from './views/home/TelestrationsHomeView';

export function TelestrationsRoutes(): JSX.Element {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:id/lobby`}>
          <TelestrationsLobbyView />
        </Route>
        <Route path={`${match.path}/:id/play`}>
          <TelestrationsPlayView />
        </Route>
        <Route path={`${match.path}/:id/results`}>
          <TelestrationsResultsView />
        </Route>
        <Route path={`${match.path}/:id`}>
          <TelestrationsRedirectManagerView />
        </Route>

        <Route path={match.path}>
          <TelestrationsHomeView />
        </Route>
      </Switch>
    </div>
  );
}