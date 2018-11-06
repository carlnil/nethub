import React from 'react'
import styled from 'styled-components'
import {
  MOVIE,
  MOVIES,
  SERIES,
  RATING,
  LANGUAGE,
  SUBTITLES,
} from '../constants'
import DropdownSelection from './utility/DropdownSelection'

function getPersonnel(personnel) {
  return personnel.length > 1
    ? personnel.reduce(
        (personnel, { name, acting_as }) =>
          acting_as
            ? personnel
              ? `${personnel}, ${name} as ${acting_as}`
              : `${name} as ${acting_as}`
            : personnel
              ? `${personnel}, ${name}`
              : `${name}`,
        ''
      )
    : personnel[0].name
}

function getLanguages(languages, id) {
  return languages
    .filter(({ media_id }) => media_id === id)
    .map(({ language }) => language)
}

export default function Media({
  media,
  category,
  filter = true,
  history,
  onHistoryChange,
  onRatingChange,
  languages,
  subtitles,
  onSubscriptionChange,
  onLanguageChange,
  onSubtitlesChange,
  completedSeasons,
}) {
  return (
    <Container>
      {media.map(media => {
        const type = media.category === MOVIE ? MOVIES : SERIES

        const mediaInfo = getMediaInfo(
          media,
          history,
          onHistoryChange,
          onRatingChange,
          onSubscriptionChange,
          onLanguageChange,
          onSubtitlesChange,
          languages,
          subtitles,
          completedSeasons
        )

        return filter ? (type === category ? mediaInfo : false) : mediaInfo
      })}
    </Container>
  )
}

function getMediaInfo(
  media,
  history,
  onHistoryChange,
  onRatingChange,
  onSubscriptionChange,
  onLanguageChange,
  onSubtitlesChange,
  languages,
  subtitles,
  completedSeasons
) {
  const title = media.is_mature ? `${media.title} 🔞` : media.title
  const directors = getPersonnel(media.directors)
  const actors = getPersonnel(media.actors)

  const seen = history.some(({ title }) => title === media.title)
  const completed = completedSeasons.some(
    ({ season_number, series_id }) =>
      media.season_number === season_number && media.series_id === series_id
  )

  return (
    <div key={media.id}>
      <h5 className="title is-5">{media.date}</h5>
      <h4 className="title is-4">{title}</h4>
      <h4 className="title is-4">{media.series}</h4>

      {media.series ? (
        <button
          className={`button ${media.subscribed ? 'is-success' : ''}`}
          style={{ marginBottom: '1em' }}
          onClick={() => onSubscriptionChange(media)}
        >
          {media.subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      ) : (
        false
      )}

      {media.series && completed ? (
        <button className="button is-disabled" style={{ marginLeft: '0.5em' }}>
          Season finished!
        </button>
      ) : (
        false
      )}

      <h6 className="title is-6">{media.season}</h6>
      <h6 className="title is-6">Year Released: {media.release_year}</h6>
      <h6 className="title is-6">Genre: {media.genre}</h6>
      <h5 className="title is-5">Director(s): {directors}</h5>
      <h5 className="title is-5">Actor(s): {actors}</h5>

      <div className="columns">
        <div className="column" style={{ marginTop: '3em' }}>
          <button
            className={`button ${seen ? 'is-warning' : 'is-info'}`}
            onClick={() => onHistoryChange(media, seen)}
          >
            {seen ? 'Mark as unseen' : 'Mark as seen'}
          </button>
        </div>
        {[
          {
            category: RATING,
            options: [1, 2, 3, 4, 5],
            defVal: 0,
            selected: media.rating,
            onChange: e => onRatingChange(media, e),
            disabled: !seen,
          },
          {
            category: LANGUAGE,
            options: getLanguages(languages, media.id),
            defVal: '',
            selected: media.locale.audio_language,
            onChange: e => onLanguageChange(media, e),
          },
          {
            category: SUBTITLES,
            options: getLanguages(subtitles, media.id),
            defVal: '',
            selected: media.locale.cc_language,
            onChange: e => onSubtitlesChange(media, e),
          },
        ].map(({ category, options, defVal, onChange, selected, disabled }) => (
          <div key={category} className="column">
            <h5 className="title is-5">{category}:</h5>
            <DropdownSelection
              onChange={onChange}
              selections={options}
              defaultValue={defVal}
              selected={selected}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
      <hr />
      <br />
    </div>
  )
}

const Container = styled.div`
  overflow-x: hidden;
  max-height: 90vh;
`
