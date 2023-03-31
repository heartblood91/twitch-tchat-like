import React from 'react'

import { MessageType } from '../util/socket-utils'

import { Button, TextAreaWithSelectIcon } from '../Components'

import pauseIcon from '../assets/pause.svg'
import downArrow from '../assets/down-arrow.svg'

type Props = {
  numberOfMessages: number,
  isScrollingPaused: boolean,
  indexOfLastMessageViewed: number,
  onSend: (text: string) => void,
  resumeScroll: () => void,
}

const SendMessage = (props: Props) => {
  const {
    shouldDisplay,
    emojiButtons,
    isOpen,

    setUserMessage,
    userMessage,

    getLabelOnResumeScroll,
    resumeScroll,
    onSend,
    onClickOnEmoji,
  } = useSendMessage(props)

  return (
    <React.Fragment>
      <div className='textfield-container'>
        {
          <div className={`scroll-pause-helper-global ${shouldDisplay.scrollPauseHelper ? '' : 'hidden'}`}>
            <div onClick={() => resumeScroll()} className='scroll-pause-helper-container' style={{ position: 'relative', cursor: 'pointer' }}>
              <div className='scroll-pause-helper'>
                <Button onClick={() => resumeScroll()} ariaLabel='resume scroll'>
                  <img src={pauseIcon} alt='automatic pause' />
                  <span>Chat paused due to scroll </span>
                </Button>
              </div>
              <div className='scroll-pause-helper'>
                <Button onClick={() => resumeScroll()} ariaLabel='resume scroll'>
                  <img src={downArrow} alt='resume' />
                  <span>{getLabelOnResumeScroll()}</span>
                </Button>
              </div>
            </div>
          </div>
        }
        <div className='textarea-with-modal-container'>
          <div>
            <TextAreaWithSelectIcon
              value={userMessage}
              setValue={setUserMessage}
              maxLength={500}
              placeholder='Send a message...'
              onClickOnIcon={onClickOnEmoji}
            />
          </div>
          <div className={`only-modal-container ${isOpen ? 'open' : ''}`}>
            {emojiButtons}
          </div>
        </div>
      </div>
      <div className='button-container'>
        <Button onClick={onSend} ariaLabel='send a message'>
          Chat
        </Button>
      </div>
    </React.Fragment>
  )
}

export default React.memo(SendMessage)

const useSendMessage = ({
  numberOfMessages,
  isScrollingPaused,
  indexOfLastMessageViewed,
  onSend: parentOnSend,
  resumeScroll,
}: Props) => {
  const [userMessage, setUserMessage] = React.useState<MessageType['text']>('')
  const [isOpen, setIsOpen] = React.useState(false)

  const onSend = React.useCallback(() => {
    if (userMessage !== '') {
      parentOnSend(userMessage)
      setUserMessage('')
      setIsOpen(false)
    }
  }, [parentOnSend, userMessage])

  // Allow sending the message directly with the enter key.
  React.useEffect(() => {
    const sendMessageWithEnterKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onSend()
      }
    }

    window.addEventListener('keypress', sendMessageWithEnterKey)

    return () => {
      window.removeEventListener('keypress', sendMessageWithEnterKey)
    }
  }, [onSend])

  const shouldDisplay = React.useMemo(() => ({
    scrollPauseHelper: isScrollingPaused,
  }), [isScrollingPaused])


  const getLabelOnResumeScroll = React.useCallback(() => {
    const messageNotViewed = numberOfMessages - indexOfLastMessageViewed - 1
    if (messageNotViewed > 20) {
      return '20+ new messages'
    } else if (messageNotViewed < 2) {
      return `${messageNotViewed} new message`
    } else {
      return `${messageNotViewed} new messages`
    }
  }, [indexOfLastMessageViewed, numberOfMessages])

  const emojisWithAria = React.useMemo(() => [
    { emoji: '😀', ariaLabel: 'Insert a happy smiley' },
    { emoji: '😂', ariaLabel: 'Insert a laughing tears smiley' },
    { emoji: '😢', ariaLabel: 'Insert a sad smiley' },
    { emoji: '😎', ariaLabel: 'Insert a cool smiley with sunglasse' },
    { emoji: '😍', ariaLabel: 'Insert a love-struck smiley' },
    { emoji: '🤔', ariaLabel: 'Insert a thinking smiley' },
    { emoji: '😴', ariaLabel: 'Insert a sleeping smiley' },
    { emoji: '😜', ariaLabel: 'Insert a tongue-out winking smiley' },
  ], [])

  const insertEmoji = React.useCallback((emoji: string) => {
    setUserMessage((x) => `${x}${emoji}`)
  }, [setUserMessage])

  const emojiButtons = React.useMemo(() => emojisWithAria.map(({ emoji, ariaLabel }) => (
    <Button onClick={() => insertEmoji(emoji)} ariaLabel={ariaLabel}>{emoji}</Button>
  )), [emojisWithAria, insertEmoji])

  const onClickOnEmoji = React.useCallback(() => setIsOpen((x) => !x), [])

  return {
    shouldDisplay,
    emojiButtons,
    isOpen,

    setUserMessage,
    userMessage,

    getLabelOnResumeScroll,
    resumeScroll,
    onSend,
    onClickOnEmoji,
  }
}
