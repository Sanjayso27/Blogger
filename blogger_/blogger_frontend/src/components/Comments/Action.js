import React from 'react'

export const Action = ({handleClick,type,className}) => {
  return (
    <div className={className} onClick={handleClick}>{type}</div>
  )
}
