import React from 'react'
import { Checkbox, CheckboxGroup } from 'react-checkbox-group'

export default function FilterSelection({
  onSelection: handleChange,
  categories,
  activeFilters,
}) {
  return (
    <CheckboxGroup
      value={activeFilters}
      onChange={handleChange}
      checkboxDepth={2}
    >
      {categories.map(category => (
        <label key={category} style={{ marginRight: '1em' }}>
          <Checkbox value={category} style={{ marginRight: '0.5em' }} />{' '}
          {category}
        </label>
      ))}
    </CheckboxGroup>
  )
}
