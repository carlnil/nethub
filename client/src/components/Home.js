import React, { useState } from 'react'
import { Checkbox, CheckboxGroup } from 'react-checkbox-group'
import styled from 'styled-components'
import Media from './Media'
import {
  MOVIES,
  SERIES,
  NAME,
  GENRE,
  DIRECTOR,
  ACTOR,
  LANGUAGE,
  INPUT,
} from '../constants'

export default function Home({ onSearch, media, user }) {
  const [activeCategory, setActiveCategory] = useState(MOVIES)
  const [activeFilters, setActiveFilters] = useState([NAME])
  const [rating, setRating] = useState(0)
  const [remainingEpisodes, setRemainingEpisodes] = useState(0)

  function handleSubmit(e) {
    e.preventDefault()
    const term = e.target[INPUT].value
    onSearch({
      id: user.id,
      term,
      category: activeCategory,
      filters: activeFilters,
      rating,
      remainingEpisodes,
    })
  }

  function handleCategorySelection({ target: { value: category } }) {
    setActiveCategory(category)
  }

  function handleDropdownChange({ target: { value } }, type) {
    if (type === 'rating') setRating(value)
    else if (type === 'remaining episodes') setRemainingEpisodes(value)
  }

  function handleFilterSelection(values) {
    setActiveFilters(values)
  }

  return (
    <Container className="columns">
      <div className="column">
        <h4 className="title is-4">Search for your favorite media ...</h4>
        <Searchbar onSubmit={handleSubmit} />
        <Line />
        <CategorySelection onSelection={handleCategorySelection} />
        <Line />
        <DropdownSelection
          onChange={e => handleDropdownChange(e, 'rating')}
          selections={[1, 2, 3, 4, 5]}
          category="rating"
        />
        <Line />
        <FilterSelection
          activeFilters={activeFilters}
          onSelection={handleFilterSelection}
        />
        <Line />
        <DropdownSelection
          onChange={e => handleDropdownChange(e, 'remaining episodes')}
          selections={[...Array(20)].map((j, index) => index + 1)}
          category="remaining episodes"
        />
      </div>
      <div className="column">
        <Media media={media} />
      </div>
    </Container>
  )
}

const Searchbar = ({ onSubmit: handleSubmit }) => (
  <>
    <h5 className="title is-5">... by name</h5>
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
  </>
)

const CategorySelection = ({ onSelection: handleChange }) => (
  <>
    <h5 className="title is-5">... by category</h5>
    {[MOVIES, SERIES].map(type => (
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
    ))}
  </>
)

const DropdownSelection = ({
  onChange: handleChange,
  selections,
  category,
}) => (
  <>
    <h5 className="title is-5">... by {category}</h5>
    <div className="select">
      <select name="rating" defaultValue="-" onChange={handleChange}>
        <option defaultValue value={0}>
          -
        </option>
        {selections.map(rating => (
          <option key={rating} value={rating}>
            {rating}
          </option>
        ))}
      </select>
    </div>
  </>
)

const FilterSelection = ({ onSelection: handleChange, activeFilters }) => (
  <>
    <h5 className="title is-5">... by filters</h5>
    <CheckboxGroup
      value={activeFilters}
      onChange={handleChange}
      checkboxDepth={2}
    >
      {[NAME, GENRE, LANGUAGE, DIRECTOR, ACTOR].map(category => (
        <label key={category} style={{ marginRight: '1em' }}>
          <Checkbox value={category} style={{ marginRight: '0.5em' }} />{' '}
          {category}
        </label>
      ))}
    </CheckboxGroup>
  </>
)

const Line = styled.hr`
  width: 10vw;
`

const Container = styled.div`
  padding: 1em;
`
