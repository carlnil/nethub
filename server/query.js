const {
  SEARCH,
  DATABASE,
  USER,
  PASSWORD,
  MOVIES,
  HISTORY,
  NAME,
  GENRE,
  DIRECTOR,
  SERIES,
  ACTOR,
  USERS,
  LANGUAGES,
  SUBTITLES,
} = require('./constants')
const {
  GET_USERS,
  GET_LANGUAGES,
  GET_SUBTITLES,
  GET_MOVIE_HISTORY,
  GET_SERIES_HISTORY,
  GET_HISTORY_COUNT,
  GET_DIRECTORS,
  GET_ACTORS,
  GET_AUDIO_LANGUAGES,
  GET_CAPTIONS,
} = require('./queries')
const sql = require('pg-promise')()({
  database: DATABASE,
  user: USER,
  password: PASSWORD,
})

module.exports = (type, params) => {
  switch (type) {
    case USERS:
      return getUsers()
    case LANGUAGES:
      return getLanguages()
    case SUBTITLES:
      return getSubtitles()
    case MOVIES:
      return getMedia(SEARCH, { category: MOVIES, id: params.id })
    case SERIES:
      return getMedia(SEARCH, { category: SERIES, id: params.id })
    case SEARCH:
      return getMedia(SEARCH, params)
    case HISTORY:
      return getMedia(HISTORY, params)
  }
}

function getUsers() {
  return sql.query(GET_USERS)
}

function getLanguages() {
  return sql.query(GET_LANGUAGES)
}

function getSubtitles() {
  return sql.query(GET_SUBTITLES)
}

function getMedia(type, params) {
  return type === SEARCH ? getSearch(params) : getHistory(params)
}

async function getHistory(params) {
  const movies = await sql.query(
    `${GET_MOVIE_HISTORY}
     WHERE h.user_id = ${params.id}`
  )

  const series = await sql.query(
    `${GET_SERIES_HISTORY}
     WHERE h.user_id = ${params.id}`
  )

  return [...movies, ...series]
}

function queryFrom(filter, category, term) {
  switch (filter) {
    case NAME:
      return category === MOVIES
        ? `LOWER(mo.title) LIKE LOWER('%${term}%')`
        : `(LOWER(e.title) LIKE LOWER('%${term}%') OR
           LOWER(s.title) LIKE LOWER('%${term}%') OR
           LOWER(se.title) LIKE LOWER('%${term}%'))`
    case GENRE:
      return category === MOVIES
        ? `LOWER(mo.genre) LIKE LOWER('%${term}%')`
        : `LOWER(se.genre) LIKE LOWER('%${term}%')`
    case DIRECTOR:
      return `LOWER(d.name) LIKE LOWER('%${term}%')`
    case ACTOR:
      return `LOWER(a.name) LIKE LOWER('%${term}%')`
  }
}

function filterBy(filters = [], category, term) {
  return filters.map(filter => ({
    query: queryFrom(filter, category, term),
    op: 'OR',
  }))
}

function ratingFrom(rating) {
  return Number(rating) ? { query: `r.rating = ${rating}`, op: 'AND' } : false
}

function withLanguage(language) {
  return language ? { query: `al.language = '${language}'`, op: 'AND' } : ''
}

function withSubtitles(language) {
  return language ? { query: `cc.language = '${language}'`, op: 'AND' } : ''
}

function withEpisodes(remainingEpisodes, id, term, filters) {
  if (remainingEpisodes) {
    const conds = filterBy(filters, SERIES, term)
    const last = conds[conds.length - 1].query

    const statement = conds.reduce(
      (statement, { query, op }) =>
        query === last
          ? `${statement} ${query}`
          : `${statement} ${query} ${op}`,
      ''
    )

    return {
      query: `${remainingEpisodes} = (${GET_HISTORY_COUNT}
              WHERE h.user_id = ${id}
              AND (${statement}))`,
      op: 'AND',
    }
  } else {
    return false
  }
}

function getSearch(params) {
  const filteredBy = filterBy(params.filters, params.category, params.term)
  const ratingOf = ratingFrom(params.rating)
  const languageOf = withLanguage(params.language)
  const subtitlesOf = withSubtitles(params.subtitles)
  const seenEpisodes = withEpisodes(
    params.remainingEpisodes,
    params.id,
    params.term,
    params.filters
  )

  const conds = [
    seenEpisodes,
    ratingOf,
    languageOf,
    subtitlesOf,
    ...filteredBy,
  ].filter(({ query }) => query)

  if (conds.length) {
    const last = conds[conds.length - 1].query
    const statement = conds.reduce(
      (statement, { query, op }) =>
        query === last
          ? `${statement} ${query}`
          : `${statement} ${query} ${op}`,
      ''
    )

    return sql.query(
      `${params.category === MOVIES ? getMovies(params) : getSeries(params)}
      ${params.filters.includes(DIRECTOR) ? GET_DIRECTORS : ''}
      ${params.filters.includes(ACTOR) ? GET_ACTORS : ''}
      ${params.language ? GET_AUDIO_LANGUAGES : ''}
      ${params.subtitles ? GET_CAPTIONS : ''}
      ${getRatings(params.id, params.category)}
      ${
        params.onlyNew
          ? `WHERE ${statement} 
             AND m.id NOT IN (
              SELECT h.media_id id
              FROM history h
              WHERE h.user_id = ${params.id}
            )`
          : ''
      }
      WHERE ${statement}`
    )
  } else {
    return sql.query(
      `${params.category === MOVIES ? getMovies(params) : getSeries(params)}
       ${getRatings(params.id, params.category)}`
    )
  }
}

const getRatings = (userId, category) => {
  const media = category === MOVIES ? 'movies' : 'episodes'

  return `
    FULL OUTER JOIN (
      SELECT m.id, r.rating
      FROM history h
      JOIN ${media} m
      on h.media_id = m.id
      JOIN ratings r
      ON h.user_id = r.user_id
      AND h.media_id = r.media_id
      WHERE h.user_id = ${userId}
    ) r
    ON r.id = m.id`
}

function getMovies({ language, subtitles }) {
  return `
    SELECT ${
      language || subtitles ? 'DISTINCT' : ''
    } m.id, mo.title, mo.genre, r.rating, m.category
    FROM media m
    JOIN movies mo
    ON m.id = mo.id`
}

function getSeries({ language, subtitles }) {
  return `
  SELECT ${
    language || subtitles ? 'DISTINCT' : ''
  } m.id, e.title, se.title series, s.title season, se.genre, r.rating, m.category
  FROM media m
  JOIN episodes e
  ON m.id = e.id
  JOIN seasons s
  ON e.series_id = s.series_id
  AND e.season_number = s.season_number
  JOIN series se
  ON s.series_id = se.id`
}
