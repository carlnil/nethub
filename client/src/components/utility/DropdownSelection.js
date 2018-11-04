import React from 'react'

export default function DropdownSelection({
  onChange,
  selections = [],
  defaultValue = 0,
  selected,
}) {
  return (
    <div className="select">
      <select defaultValue={selected} onChange={onChange}>
        <option value={defaultValue}>-</option>
        {selections.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
