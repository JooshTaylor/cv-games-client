import React from 'react';
import { useMatch, Routes, Route } from 'react-router-dom';

export function WordleRoutes(): JSX.Element {
  const match = useMatch('/wordle');

  return (
    <div>
      <Routes>
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

        <Route path={match?.pathname}>
          Wordle home
        </Route>
      </Routes>
    </div>
  );
}