import React from 'react';
import { Socket } from 'socket.io-client';

export const SocketIoContext = React.createContext<Socket>(null as any);