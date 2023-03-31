import React from 'react'

import { MessageType } from '../util/socket-utils'
import subPrime from '../assets/subPrime.png'

type Props = {
  message: MessageType,
  isSelected: boolean,
  index: number,
  onClick: () => void,
}

const OneMessage = ({
  message,
  isSelected,
  index,
  onClick,
}: Props) => {
  const shouldDisplayPrime = Boolean(message.user.username === 'Loïc')

  return (
    <div
      className={isSelected ? 'message-container selected' : 'message-container'}
      onClick={() => onClick()}
      aria-selected={isSelected}
      tabIndex={index}
    >
      <span>
        {shouldDisplayPrime && <img className='userbadge' src={subPrime} alt='prime sub' />}
        <span className='username' style={{
          color: message.user.color,
        }}>
          {`${message.user.username}: `}
        </span>
      </span>
      <span className='usermessage'>{message.text}</span>
    </div>
  )
}

export default React.memo(OneMessage)
