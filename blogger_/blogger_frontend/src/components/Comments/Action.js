import React from 'react'

export const Action = ({handleClick,type,className,disabled}) => {
  return (
    !disabled && <div className={className} onClick={handleClick} >{type}</div>
  )
}
