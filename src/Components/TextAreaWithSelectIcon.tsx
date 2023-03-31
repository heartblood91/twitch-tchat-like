import React from 'react'

import smiley from '../assets/smiley1.svg'
import Button from './Button'

type Props = {
  value: string,
  setValue: (value: string) => void,
  onClickOnIcon: () => void,

  maxLength?: number,
  placeholder?: string,
}

const TextAreaWithSelectIcon = ({
  value,
  setValue,
  onClickOnIcon,

  maxLength,
  placeholder,
}: Props) => {
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }

  const computeRows = React.useCallback(() => {
    const length = value.length
    const maxLengthByRow = 32
    const rows = Math.ceil(length / maxLengthByRow)

    return Math.max(rows, 1)
  }, [value.length])

  return (
    <div className='textarea-container'>
      <textarea
        onChange={onChange}
        value={value}
        rows={computeRows()}
        maxLength={maxLength}
        placeholder={placeholder}
      />

      <div className='smiley-icon-container'>
        <Button onClick={onClickOnIcon} ariaLabel='Add icon into the text'>
          <img src={smiley} alt='logo' />
        </Button>
      </div>
    </div>
  )
}

export default React.memo(TextAreaWithSelectIcon)
