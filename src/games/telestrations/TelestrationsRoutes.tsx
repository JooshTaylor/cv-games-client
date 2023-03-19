import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { TelestrationsRedirectManagerView } from './views/game/TelestrationsRedirectManagerView';
import { TelestrationsLobbyView } from './views/game/lobby/TelestrationsLobbyView';
import { TelestrationsPlayView } from './views/game/play/TelestrationsPlayView';
import { TelestrationsResultsView } from './views/game/results/TelestrationsResultsView';
import { TelestrationsHomeView } from './views/home/TelestrationsHomeView';

export function TelestrationsRoutes(): JSX.Element {
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
        <Route path='/:id/lobby' element={<TelestrationsLobbyView />} />
        <Route path='/:id/play' element={<TelestrationsPlayView />} />
        <Route path='/:id/results' element={<TelestrationsResultsView />} />
        <Route path='/:id' element={<TelestrationsRedirectManagerView />} />
        <Route path='/' element={<TelestrationsHomeView />} />
      </Routes>
    </React.Fragment>
  );
}