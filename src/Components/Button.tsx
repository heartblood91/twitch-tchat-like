import React from 'react'

type Props = {
  onClick: () => void,
  ariaLabel?: string,
}

const Button = ({
  children,
  ariaLabel,
  onClick: parentOnClick,
}: React.PropsWithChildren<Props>) => {
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault()
    parentOnClick()
  }

  return (
    <button
      type='button'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default React.memo(Button)
