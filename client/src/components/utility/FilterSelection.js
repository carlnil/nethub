import React from 'react'
import { Checkbox, CheckboxGroup } from 'react-checkbox-group'
import { NAME, GENRE, DIRECTOR, ACTOR } from '../../constants'

export default function FilterSelection({
  onSelection: handleChange,
  activeFilters,
}) {
  return (
    <CheckboxGroup
      value={activeFilters}
      onChange={handleChange}
      checkboxDepth={2}
    >
      {[NAME, GENRE, DIRECTOR, ACTOR].map(category => (
        <label key={category} style={{ marginRight: '1em' }}>
          <Checkbox value={category} style={{ marginRight: '0.5em' }} />{' '}
          {category}
        </label>
      ))}
    </CheckboxGroup>
  )
}
