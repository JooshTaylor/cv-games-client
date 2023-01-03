import React from 'react';
import { useMatch, Routes, Route } from 'react-router-dom';

import { TelestrationsRedirectManagerView } from './views/game/TelestrationsRedirectManagerView';
import { TelestrationsLobbyView } from './views/game/lobby/TelestrationsLobbyView';
import { TelestrationsPlayView } from './views/game/play/TelestrationsPlayView';
import { TelestrationsResultsView } from './views/game/results/TelestrationsResultsView';
import { TelestrationsHomeView } from './views/home/TelestrationsHomeView';

export function TelestrationsRoutes(): JSX.Element {
  const match = useMatch('/telestrations');

  React.useEffect(() => {
    const beforeUnloadListener = (event: any) => {
      event.preventDefault();
      return event.returnValue = "Please don't reload the page";
    };

    window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
    };
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route path={`${match?.pathname}/:id/lobby`}>
          <TelestrationsLobbyView />
        </Route>
        <Route path={`${match?.pathname}/:id/play`}>
          <TelestrationsPlayView />
        </Route>
        <Route path={`${match?.pathname}/:id/results`}>
          <TelestrationsResultsView />
        </Route>
        <Route path={`${match?.pathname}/:id`}>
          <TelestrationsRedirectManagerView />
        </Route>

        <Route path={match?.pathname}>
          <TelestrationsHomeView />
        </Route>
      </Routes>
    </React.Fragment>
  );
}