import React from 'react'
import io from 'socket.io-client'

const CONNECTION_URL = 'wss://api.dev.stories.studio/'
const SOCKET_PATH = '/interview-test'
const SOCKET_TRANSPORTS = ['websocket']

const connectSocket = () => {
  const socket = io(CONNECTION_URL, {
    transport: SOCKET_TRANSPORTS,
    path: SOCKET_PATH
  })

  return socket
}

const App = () => {
  return (
    <Tchat />
  )
}

export default App


const Tchat = () => {
  const [messages, setMessages] = React.useState([])
  const [newMessage, setNewMessage] = React.useState('')
  const socketRef = React.useRef(null)
  const tchatRef = React.useRef(null)

  React.useEffect(() => {
    socketRef.current = connectSocket()

    socketRef.current.on('new-message', (message) => {
      setMessages(messages => [
        ...messages,
        message
      ])
    })

    return () => socketRef.current.close()
  }, [])

  const onClick = () => {
    socketRef.current.emit('send-message', {
      text: newMessage,
      user: {
        username: 'Coucou',
        color: '#cc99ff',
      },
    })
  }

  const onChange = (event) => {
    setNewMessage(event.target.value)
  }

  React.useEffect(() => {
    if (tchatRef.current.lastElementChild) {
      tchatRef.current.lastElementChild.scrollIntoView()
    }

  }, [messages])

  return (
    <div>
      <div ref={tchatRef} style={{
        height: '200px',
        overflow: 'scroll',
      }}>
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <span style={{
                color: message.user.color,
              }}>
                {`${message.user.username}: `}
              </span>
              <span>{message.text}</span>
            </div>
          )
        })}
      </div>
      <div>
        <input type='text' onChange={onChange} value={newMessage} />
        <button type='button' onClick={() => onClick()} style={{ cursor: 'pointer' }}>
          Ajouter un message
        </button>
      </div>
    </div>
  )
}