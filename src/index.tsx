import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { io } from 'socket.io-client';

import { SocketIoContext } from './shared/contexts/SocketIoContext';

import './styles.scss';

import { App } from './App';

const serverUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://cv-games-api.herokuapp.com';

axios.defaults.baseURL = `${serverUrl}/api`;

const socket = io(serverUrl);

const root = createRoot(document.getElementById('root'));

socket.on('connect', () => {
  root.render(
    <React.StrictMode>
      <SocketIoContext.Provider value={socket}>
        <App />
      </SocketIoContext.Provider>
    </React.StrictMode>
  );
});