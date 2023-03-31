import React from 'react'

import { MessageType } from '../util/socket-utils'

import OneMessage from './OneMessage'

type Props = {
  tchatElRef: React.MutableRefObject<HTMLDivElement | null>,
  messages: MessageType[],

  isScrollingPaused: boolean,
  setIsScrollingPaused: React.Dispatch<React.SetStateAction<boolean>>,
  setIndexOfLastMessageViewed: React.Dispatch<React.SetStateAction<number>>,
}

const Tchat = (props: Props) => {
  const {
    elements,
    isOverflowed,
    tchatElRef,
    handleScroll,
  } = useTchat(props)

  return (
    <div
      ref={tchatElRef}
      className={`tchat ${isOverflowed ? 'overflow-on' : ''}`}
      onScroll={handleScroll}
      role='region'
      aria-live='polite'
    >
      {elements}
    </div>
  )
}

export default React.memo(Tchat)

const useTchat = ({
  tchatElRef,
  isScrollingPaused,
  setIsScrollingPaused,
  setIndexOfLastMessageViewed,
  messages,
}: Props) => {
  const [selectedMessageIndex, setSelectedMessageIndex] = React.useState<number>(-1)
  const [isOverflowed, setIsOverflowed] = React.useState(false)

  // Allow navigating between messages using the keyboard.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelectedMessageIndex(prevIndex => Math.max(prevIndex - 1, 0))
      } else if (event.key === 'ArrowDown') {
        setSelectedMessageIndex(prevIndex => Math.min(prevIndex + 1, messages.length - 1))
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [messages])

  // Navigate to the message using arrow keys on the keyboard.
  React.useEffect(() => {
    if (selectedMessageIndex) {
      tchatElRef.current?.children[selectedMessageIndex]?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedMessageIndex, tchatElRef])

  // Pause automatic scrolling. 
  const handleScroll = React.useCallback(() => {
    if (tchatElRef.current?.lastElementChild) {
      const isScrollingPaused = tchatElRef.current.scrollTop < tchatElRef.current.scrollHeight - tchatElRef.current.offsetHeight

      setIsScrollingPaused(isScrollingPaused)
      setIndexOfLastMessageViewed(messages.length - 1)
    }
  }, [messages.length, setIndexOfLastMessageViewed, setIsScrollingPaused, tchatElRef])

  // Scroll to the latest message
  React.useEffect(() => {
    if (tchatElRef.current?.lastElementChild && !isScrollingPaused) {
      tchatElRef.current.lastElementChild.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isScrollingPaused, tchatElRef])

  const getIsSelected = React.useCallback((index: number) => index === selectedMessageIndex, [selectedMessageIndex])

  const elements = React.useMemo(() => {
    return messages.map((message, index) => {
      const key = message.date ?? `${index}_${message}`
      return (
        <OneMessage
          isSelected={getIsSelected(index)}
          onClick={() => setSelectedMessageIndex(index)}
          message={message}
          key={key}
          index={index}
        />
      )
    })
  }, [messages, getIsSelected])

  const checkOverFlow = React.useCallback(() => {
    const container = tchatElRef.current

    if (container?.children.length === 0) {
      setIsOverflowed(false)
    } else if ((container?.scrollHeight ?? 0) > (container?.clientHeight ?? 0)) {
      setIsOverflowed(true)
    } else {
      setIsOverflowed(false)
    }
  }, [tchatElRef])

  React.useEffect(() => {
    checkOverFlow()
  }, [checkOverFlow, messages.length])

  return {
    elements,
    isOverflowed,
    tchatElRef,
    handleScroll,
  }
}
