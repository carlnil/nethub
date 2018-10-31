const {
  SEARCH,
  CONNECTED,
  DATABASE,
  USER,
  PASSWORD,
  MOVIES,
  SERIES,
  HISTORY,
  NAME,
  GENRE,
  DIRECTOR,
  ACTOR,
  LANGUAGE,
} = require('./constants')
const sql = require('pg-promise')()({
  database: DATABASE,
  user: USER,
  password: PASSWORD,
})

module.exports = (type, params) => {
  switch (type) {
    case CONNECTED:
      return getUsers()
    case SEARCH:
      return getMedia(SEARCH, params)
    case HISTORY:
      return getMedia(HISTORY, params)
  }
}

function getUsers() {
  return sql.query(
    `SELECT *
     FROM users`
  )
}

function getMedia(type, params) {
  return type === SEARCH ? getSearchResults(params) : getHistory(params)
}

function getSearchResults(params) {
  return params.category === MOVIES ? getMovies(params) : getSeries(params)
}

function getMovies(params) {
  return sql.query(
    `SELECT m.id, mo.title, mo.genre, r.rating
     FROM media m
     JOIN movies mo
     ON m.id = mo.id
     FULL OUTER JOIN (
       SELECT m.id, r.rating
       FROM history h
       JOIN movies m 
       on h.media_id = m.id
       JOIN ratings r
       ON h.user_id = r.user_id 
       AND h.media_id = r.media_id
       WHERE h.user_id = $1
     ) r
     ON r.id = mo.id
     WHERE $2:raw`,
    [params.id, filter(MOVIES, params)]
  )
}

function getSeries(params) {
  console.log(filter(SERIES, params))
  return sql.query(
    `SELECT e.id, e.title, s.title season, se.title series, se.genre, r.rating
     FROM media m
     JOIN episodes e
     ON m.id = e.id
     JOIN seasons s
     ON e.series_id = s.series_id
     AND e.season_number = s.season_number
     JOIN series se
     ON e.series_id = se.id
     FULL OUTER JOIN (
       SELECT e.id, r.rating
       FROM history h
       JOIN episodes e
       on h.media_id = e.id
       JOIN ratings r
       ON h.user_id = r.user_id 
       AND h.media_id = r.media_id
       WHERE h.user_id = $1
     ) r
     ON r.id = e.id
     WHERE $2:raw`,
    [params.id, filter(SERIES, params)]
  )
}

function filterBy(type, { term, filters, rating, category }) {
  switch (type) {
    case 'title':
      return category === MOVIES
        ? `LOWER(mo.title) LIKE LOWER('%${term}%')`
        : `LOWER(e.title) LIKE LOWER('%${term}%') OR
           LOWER(s.title) LIKE LOWER('%${term}%') OR
           LOWER(se.title) LIKE LOWER('%${term}%')`
    case 'genre':
      return category === MOVIES
        ? `LOWER(mo.genre) LIKE LOWER('%${term}%')`
        : `LOWER(se.genre) LIKE LOWER('%${term}%')`
    case 'rating':
      return `r.rating = ${rating}`
  }
}

function filter(type, params) {
  const { filters } = params
  const title = filters.includes(NAME) ? filterBy('title', params) : ''
  const genre = filters.includes(GENRE) ? filterBy('genre', params) : ''
  const rating = params.rating ? filterBy('rating', params) : ''

  const test = cond => cond !== ''
  const conds = [title, genre].filter(test)
  const last = conds[conds.length - 1]

  const statement = conds.length
    ? conds.reduce((statement, cond) => {
        return cond !== last
          ? `${statement} ${cond} OR`
          : `${statement} ${cond}`
      }, '')
    : '1=1'

  return `(${statement}) ${rating ? `AND ${rating}` : ''}`
}

async function getHistory(params) {
  const movies = await sql.query(
    `
    SELECT h.media_id id, m.title, r.rating, m.genre
    FROM history h
    JOIN movies m 
    on h.media_id = m.id
    FULL OUTER JOIN ratings r
    ON h.user_id = r.user_id 
    AND h.media_id = r.media_id
    WHERE h.user_id = $1
  `,
    [params.id]
  )

  const series = await sql.query(
    `
    SELECT h.media_id id, e.title, s.title season, se.title series, r.rating, se.genre
    FROM history h
    JOIN episodes e
    ON h.media_id = e.id
    JOIN seasons s
    ON e.season_number = s.season_number
    AND e.series_id = s.series_id
    JOIN series se
    ON s.series_id = se.id
    FULL OUTER JOIN ratings r
    ON h.user_id = r.user_id 
    AND h.media_id = r.media_id
    WHERE h.user_id = $1
  `,
    [params.id]
  )

  return [...movies, ...series]
}
