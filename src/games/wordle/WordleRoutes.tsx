import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

export function WordleRoutes(): JSX.Element {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        {/* <Route path={`${match.path}/:id/lobby`}>
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
        </Route> */}

        <Route path={match.path}>
          Wordle home
        </Route>
      </Switch>
    </div>
  );
}