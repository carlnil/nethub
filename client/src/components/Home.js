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
  RATING,
  REMAINING_EPISODES,
  SUBTITLES,
  MOVIE,
  EPISODE,
} from '../constants'

export default function Home({ onSearch, media, languages, subtitles, user }) {
  const [activeCategory, setActiveCategory] = useState(MOVIES)
  const [activeFilters, setActiveFilters] = useState([NAME])
  const [activeLanguage, setActiveLanguage] = useState('')
  const [activeSubtitles, setActiveSubtitles] = useState('')
  const [rating, setRating] = useState(0)
  const [remainingEpisodes, setRemainingEpisodes] = useState(0)

  function handleSubmit(e) {
    e.preventDefault()
    const term = e.target[INPUT].value
    if (term) {
      onSearch({
        id: user.id,
        term,
        category: activeCategory,
        filters: activeFilters,
        rating,
        remainingEpisodes,
        language: activeLanguage,
        subtitles: activeSubtitles,
      })
    }
  }

  function getLanguages(languages) {
    return languages
      .map(
        ({ category, language }) =>
          category === EPISODE && activeCategory === SERIES
            ? language
            : category === MOVIE && activeCategory === MOVIES
              ? language
              : false
      )
      .filter(language => language)
  }

  function handleCategorySelection({ target: { value: category } }) {
    setActiveCategory(category)
  }

  function handleDropdownChange({ target: { value } }, type) {
    if (type === RATING) setRating(value)
    else if (type === REMAINING_EPISODES) setRemainingEpisodes(value)
    else if (type === LANGUAGE) setActiveLanguage(value)
    else if (type === SUBTITLES) setActiveSubtitles(value)
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
        <FilterSelection
          activeFilters={activeFilters}
          onSelection={handleFilterSelection}
        />
        <Line />
        <DropdownSelection
          onChange={e => handleDropdownChange(e, RATING)}
          selections={[1, 2, 3, 4, 5]}
          category="rating"
          defaultValue={0}
        />
        <Line />
        <DropdownSelection
          onChange={e => handleDropdownChange(e, LANGUAGE)}
          selections={getLanguages(languages)}
          category="language"
          defaultValue={''}
        />
        <Line />
        <DropdownSelection
          onChange={e => handleDropdownChange(e, SUBTITLES)}
          selections={getLanguages(subtitles)}
          category="subtitles"
          defaultValue={''}
        />
        <Line />
        {activeCategory === SERIES ? (
          <DropdownSelection
            onChange={e => handleDropdownChange(e, REMAINING_EPISODES)}
            selections={[...Array(20)].map((i, j) => j + 1)}
            category="remaining episodes"
            defaultValue={0}
          />
        ) : (
          false
        )}
      </div>
      <div className="column">
        <Media media={media} category={activeCategory} />
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
  defaultValue,
}) => (
  <>
    <h5 className="title is-5">... by {category}</h5>
    <div className="select">
      <select name="rating" defaultValue="-" onChange={handleChange}>
        <option defaultValue value={defaultValue}>
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
      {[NAME, GENRE, DIRECTOR, ACTOR].map(category => (
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
