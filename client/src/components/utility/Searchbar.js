import React from 'react'

export default function Searchbar({ onSubmit: handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="field has-addons">
        <div className="control">
          <input className="input" name="input" />
        </div>
        <div className="control">
          <button className="button is-info">
            <span role="img" aria-label="search">
              🔎
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
