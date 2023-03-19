import React from 'react';
import { Routes, Route } from 'react-router-dom';

export function WordleRoutes(): JSX.Element {
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

        <Route path='/' element={<>Wordle home</>} />
      </Routes>
    </div>
  );
}