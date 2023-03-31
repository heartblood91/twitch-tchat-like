import io, { Socket } from 'socket.io-client'

const CONNECTION_URL = 'wss://api.dev.stories.studio/'
const SOCKET_PATH = '/interview-test'

const connectSocket = () => {
  const socket = io(CONNECTION_URL, {
    path: SOCKET_PATH
  })

  return socket
}

export type SocketType = Socket

export type MessageType = {
  text: string,
  type: string,
  user: {
    username: string,
    color: string,
  },
  date: number,
}

export const SocketUtils = {
  connectSocket,
}

