import React, { useState } from 'react'
import styled from 'styled-components'
import Media from './Media'
import CategorySelection from './utility/CategorySelection'
import DropdownSelection from './utility/DropdownSelection'
import Searchbar from './utility/Searchbar'
import FilterSelection from './utility/FilterSelection'
import {
  MOVIES,
  SERIES,
  NAME,
  LANGUAGE,
  INPUT,
  RATING,
  SUBTITLES,
  MOVIE,
  GENRE,
  DIRECTOR,
  ACTOR,
  REMAINING_EPISODES,
} from '../constants'

export default function Home({
  onSearch,
  media,
  history,
  languages,
  subtitles,
  user,
  onHistoryChange,
  onRatingChange,
  onLanguageChange,
  onSubtitlesChange,
  onSubscriptionChange,
  completedSeasons,
  setSearchFilters,
}) {
  const [activeCategory, setActiveCategory] = useState(MOVIES)
  const [activeFilters, setActiveFilters] = useState([NAME])
  const [activeLanguage, setActiveLanguage] = useState('')
  const [activeSubtitles, setActiveSubtitles] = useState('')
  const [rating, setRating] = useState(0)
  const [newMedia, setNewMedia] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const term = e.target[INPUT].value
    const params = {
      id: user.id,
      contentFilters: user.contentFilters,
      content_filtered: user.content_filtered,
      term,
      category: activeCategory,
      filters: activeFilters,
      rating,
      language: activeLanguage,
      subtitles: activeSubtitles,
      newMedia,
    }
    setSearchFilters(params)
    onSearch(params)
  }

  function getLanguages(languages) {
    return [
      ...new Set(
        languages
          .filter(({ category }) => {
            const type = category === MOVIE ? MOVIES : SERIES
            return type === activeCategory
          })
          .map(({ language }) => language)
      ),
    ]
  }

  function handleCategorySelection({ target: { value: category } }) {
    setActiveCategory(category)
  }

  function handleDropdownChange({ target: { value } }, type) {
    if (type === RATING) setRating(value)
    else if (type === LANGUAGE) setActiveLanguage(value)
    else if (type === SUBTITLES) setActiveSubtitles(value)
  }

  function handleFilterSelection(values) {
    setActiveFilters(values)
  }

  function handleNew() {
    setNewMedia(old => !old)
  }

  return (
    <Container className="columns">
      <div className="column">
        <h4 className="title is-4">Search for your favorite media ...</h4>
        <h5 className="title is-5">... by name</h5>
        <Searchbar onSubmit={handleSubmit} />
        <Line />

        <h5 className="title is-5">... by category</h5>
        <CategorySelection onSelection={handleCategorySelection} />
        <Line />

        <label>
          <input type="checkbox" value={newMedia} onChange={handleNew} />
          <span style={{ marginLeft: '0.5em' }}>Show only new media</span>
        </label>
        <Line />

        <h5 className="title is-5">... by filters</h5>
        <FilterSelection
          activeFilters={activeFilters}
          onSelection={handleFilterSelection}
          categories={
            activeCategory === MOVIES
              ? [NAME, GENRE, DIRECTOR, ACTOR]
              : [NAME, GENRE, DIRECTOR, ACTOR, REMAINING_EPISODES]
          }
        />
        <Line />

        {[
          { category: RATING, options: [1, 2, 3, 4, 5], defVal: 0 },
          { category: LANGUAGE, options: getLanguages(languages), defVal: '' },
          { category: SUBTITLES, options: getLanguages(subtitles), defVal: '' },
        ].map(({ category, options, defVal }) => (
          <React.Fragment key={category}>
            <h5 className="title is-5">... by {category.toLowerCase()}</h5>
            <DropdownSelection
              onChange={e => handleDropdownChange(e, category)}
              selections={options}
              defaultValue={defVal}
            />
            <Line />
          </React.Fragment>
        ))}
      </div>

      <div className="column">
        <Media
          media={media}
          history={history}
          category={activeCategory}
          onHistoryChange={onHistoryChange}
          onRatingChange={onRatingChange}
          onLanguageChange={onLanguageChange}
          onSubtitlesChange={onSubtitlesChange}
          onSubscriptionChange={onSubscriptionChange}
          languages={languages}
          subtitles={subtitles}
          completedSeasons={completedSeasons}
          setSearchFilters={setSearchFilters}
        />
      </div>
    </Container>
  )
}

const Line = styled.hr`
  width: 10vw;
`

const Container = styled.div`
  padding: 1em;
`
