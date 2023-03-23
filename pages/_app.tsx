import type { AppProps } from 'next/app';
import axios from 'axios';
import { io } from 'socket.io-client';

import { SocketIoContext } from '@/shared/contexts/SocketIoContext';

import '../styles/styles.scss';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://joshuataylor.dev';

axios.defaults.baseURL = `${serverUrl}/api`;

const socket = io(serverUrl);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketIoContext.Provider value={socket}>
      <Component {...pageProps} />;
    </SocketIoContext.Provider>
  );
}