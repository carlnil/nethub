import React from 'react'
import { MOVIES, SERIES } from '../../constants'

export default function CategorySelection({ onSelection: handleChange }) {
  return [MOVIES, SERIES].map(type => (
    <label key={type}>
      <div className="form-check">
        <input
          name="content_type"
          className="form-check-input"
          type="radio"
          value={type}
          defaultChecked={type === 'Movies'}
          onChange={handleChange}
          style={{ marginRight: '0.5em' }}
        />
        {type}
      </div>
    </label>
  ))
}
