import React from 'react'

import { SocketUtils, SocketType, MessageType } from '../util/socket-utils'

import Header from './Header'
import Tchat from './Tchat'
import SendMessage from './SendMessage'

const TchatView = () => {
  const {
    indexOfLastMessageViewed,
    setIndexOfLastMessageViewed,
    isScrollingPaused,
    setIsScrollingPaused,
    
    tchatElRef,
    messages,
    resumeScroll,
    onSend,
  } = useTchatView()

  return (
    <div className='tchat-container'>
      <Header />
      <Tchat
        isScrollingPaused={isScrollingPaused}
        setIsScrollingPaused={setIsScrollingPaused}
        setIndexOfLastMessageViewed={setIndexOfLastMessageViewed}
        messages={messages}
        tchatElRef={tchatElRef}
      />
      <SendMessage
        numberOfMessages={messages.length}
        isScrollingPaused={isScrollingPaused}
        indexOfLastMessageViewed={indexOfLastMessageViewed}
        onSend={onSend}
        resumeScroll={resumeScroll}
      />
    </div>
  )
}

export default React.memo(TchatView)

const useTchatView = () => {
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [isScrollingPaused, setIsScrollingPaused] = React.useState<boolean>(false)
  const [indexOfLastMessageViewed, setIndexOfLastMessageViewed] = React.useState<number>(0)
  const socketRef = React.useRef<SocketType | null>(null)
  const tchatElRef = React.useRef<HTMLDivElement | null>(null)

  const resumeScroll = React.useCallback(() => {
    tchatElRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    setIsScrollingPaused(false)
  }, [])

  React.useEffect(() => {
    socketRef.current = SocketUtils.connectSocket()

    socketRef.current.on('new-message', (message: MessageType) => {
      setMessages(messages => [
        ...messages,
        message
      ])
    })

    return () => {
      socketRef.current?.close()
    }
  }, [])

  const onSend = React.useCallback((text: string) => {
    socketRef.current?.emit('send-message', {
      text,
      user: {
        username: 'Loïc',
        color: '#ff7f50',
      },
    })
  }, [])

  // This allows to clean up old messages.
  React.useEffect(() => {
    const limitMessages = 10000
    if (messages.length > limitMessages) {
      setMessages(messages => messages.slice(limitMessages))
    }
  }, [messages])

  return {
    indexOfLastMessageViewed,
    setIndexOfLastMessageViewed,
    isScrollingPaused,
    setIsScrollingPaused,
    
    tchatElRef,
    messages,
    resumeScroll,
    onSend,
  }
}
