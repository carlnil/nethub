const {
  SEARCH,
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
  UPDATE,
  SUBSCRIPTION,
  RATING,
  LANGUAGE,
  CONTENT_FILTER,
  METADATA,
  EPISODES,
  SEASONS,
  ACTORS,
  DIRECTORS,
  GENRES,
  MATURE_FILTER,
  COMPLETED_SEASONS,
  SUBSCRIPTIONS,
  REMAINING_EPISODES,
} = require('./constants')
const {
  GET_USERS,
  GET_LANGUAGES,
  GET_SUBTITLES,
  GET_MOVIE_HISTORY,
  GET_SERIES_HISTORY,
  GET_DIRECTORS,
  GET_ACTORS,
  GET_AUDIO_LANGUAGES,
  GET_CAPTIONS,
  GET_FILTERS,
  GET_CHILDREN,
  GET_TOTAL_EPISODES_PER_SERIES,
} = require('./queries')

module.exports = (sql, type, params) => {
  switch (type) {
    case USERS:
      return getUsers(sql)
    case METADATA:
      return getMetadata(sql)
    case SUBSCRIPTIONS:
      return getSubscriptions(sql, params)
    case LANGUAGES:
      return sql.query(GET_LANGUAGES)
    case COMPLETED_SEASONS:
      return getCompletedSeasonsMetadata(sql, params)
    case SUBTITLES:
      return sql.query(GET_SUBTITLES)
    case MOVIES:
      return getMedia(sql, SEARCH, { ...params, category: MOVIES, first: true })
    case SERIES:
      return getMedia(sql, SEARCH, { ...params, category: SERIES, first: true })
    case SEARCH:
      return getMedia(sql, SEARCH, params)
    case HISTORY:
      return getMedia(sql, HISTORY, params)
    case UPDATE:
      updateDatabase(sql, params)
      break
    case MATURE_FILTER:
      updateDatabase(sql, params)
      break
    case CONTENT_FILTER:
      updateDatabase(sql, params)
      break
  }
}

async function getUsers(sql) {
  const users = await sql.query(GET_USERS)
  const children = await sql.query(GET_CHILDREN)
  const filters = await sql.query(GET_FILTERS)
  const acc = {
    movies: [],
    series: [],
    seasons: [],
    episodes: [],
    actors: [],
    directors: [],
    genres: [],
  }

  // prettier-ignore
  return users.map(user => ({
    ...user,
    contentFilters: filters
      .filter(({ user_id }) => user_id === user.id)
      .reduce((filters, { category, filter }) => ({
          ...filters,
          [category]: [...filters[category], filter]
        }) , acc),
    children: children
      .filter(({ parent_id }) => parent_id === user.id)
      .map(({ child_id }) => ({ id: child_id })),
  }))
}

async function getMetadata(sql) {
  const movies = await sql.query('SELECT title, genre FROM movies')
  const series = await sql.query('SELECT title, genre FROM series')
  const seasons = await sql.query('SELECT title FROM seasons')
  const episodes = await sql.query('SELECT title FROM episodes')
  const actors = await sql.query('SELECT DISTINCT name FROM actors')
  const directors = await sql.query('SELECT DISTINCT name FROM directors')

  const genres = [
    ...new Set([
      ...movies.map(({ genre }) => genre),
      ...series.map(({ genre }) => genre),
    ]),
  ]

  return [
    {
      category: MOVIES.toLowerCase(),
      list: movies.map(({ title }) => title),
    },
    {
      category: SERIES.toLowerCase(),
      list: series.map(({ title }) => title),
    },
    {
      category: SEASONS.toLowerCase(),
      list: seasons.map(({ title }) => title),
    },
    {
      category: EPISODES.toLowerCase(),
      list: episodes.map(({ title }) => title),
    },
    {
      category: ACTORS.toLowerCase(),
      list: actors.map(({ name }) => name),
    },
    {
      category: DIRECTORS.toLowerCase(),
      list: directors.map(({ name }) => name),
    },
    {
      category: GENRES.toLowerCase(),
      list: genres,
    },
  ]
}

function getMedia(sql, type, params) {
  return type === SEARCH ? getSearch(sql, params) : getHistory(sql, params)
}

async function getHistory(sql, { id }) {
  const baseQuery = {
    locale: `SELECT * FROM locale l WHERE l.user_id = ${id}`,
    personnel: {
      actors: 'SELECT * FROM actors',
      directors: 'SELECT * FROM directors',
    },
  }

  const movies = await searchDatabase(sql, {
    ...baseQuery,
    media: `${GET_MOVIE_HISTORY} WHERE h.user_id = ${id}`,
  })

  const series = await searchDatabase(sql, {
    ...baseQuery,
    subscriptions: `SELECT * FROM subscriptions s WHERE s.user_id = ${id}`,
    media: `${GET_SERIES_HISTORY} WHERE h.user_id = ${id}`,
  })

  return { media: [...movies, ...series] }
}

function getCompletedSeasonsMetadata(sql, { user_id }) {
  const query = `SELECT s.title, s.season_number, s.series_id, s.episode_count, COUNT(*) seen_episodes
                   FROM (
                     SELECT h.media_id id, s.title, s.season_number, s.episode_count, s.series_id
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
                     WHERE h.user_id = ${user_id}
                   ) s
                   GROUP BY s.title, s.series_id, s.season_number, s.episode_count
                   HAVING COUNT(*) = s.episode_count`

  return sql.query(query)
}

function getSubscriptions(sql, { id }) {
  const query = `SELECT se.title, se.id
                 FROM subscriptions s
                 JOIN series se
                 ON s.series_id = se.id
                 WHERE s.user_id = ${id}`

  return sql.query(query)
}

function categoriesFrom(contentFilters) {
  return Object.keys(contentFilters).reduce((o, category) => {
    return {
      ...o,
      [category]: `NOT SIMILAR TO '%(${contentFilters[category]
        .join('|')
        .toLowerCase()})%'`,
    }
  }, {})
}

function queryFrom(filter, category, term, contentFilters) {
  const {
    movies,
    episodes,
    seasons,
    series,
    genres,
    directors,
    actors,
  } = categoriesFrom(contentFilters)

  const filtered = (phrase, filter) =>
    filter.length > 29 ? `${phrase} ${filter}` : ''

  switch (filter) {
    case NAME:
      return category === MOVIES
        ? `(LOWER(mo.title) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(mo.title)',
            movies
          )})`
        : `((LOWER(e.title) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(e.title)',
            episodes
          )}) OR
           (LOWER(s.title) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(s.title)',
            seasons
          )}) OR
           (LOWER(se.title) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(se.title)',
            series
          )}))`
    case GENRE:
      return category === MOVIES
        ? `(LOWER(mo.genre) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(mo.genre)',
            genres
          )})`
        : `(LOWER(se.genre) LIKE LOWER('%${term}%') ${filtered(
            'AND LOWER(se.genre)',
            genres
          )})`
    case DIRECTOR:
      return `(LOWER(d.name) LIKE LOWER('%${term}%') ${filtered(
        'AND LOWER(d.name)',
        directors
      )})`
    case ACTOR:
      return `(LOWER(a.name) LIKE LOWER('%${term}%') ${filtered(
        'AND LOWER(a.name)',
        actors
      )})`
  }
}

function filterBy(filters = [], category, term, contentFilters) {
  return filters.map(filter => ({
    query: queryFrom(filter, category, term, contentFilters),
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

function getConds({
  filters,
  category,
  term,
  rating,
  language,
  subtitles,
  contentFilters,
}) {
  const filteredBy = filterBy(filters, category, term, contentFilters)
  const ratingOf = ratingFrom(rating)
  const languageOf = withLanguage(language)
  const subtitlesOf = withSubtitles(subtitles)

  return [ratingOf, languageOf, subtitlesOf, ...filteredBy].filter(
    ({ query }) => query
  )
}

function getWhereStatement(conds) {
  const last = conds[conds.length - 1].query

  return conds.reduce((statement, { query, op }) => {
    return query === last
      ? `${statement} ${query}`
      : `${statement} ${query} ${op}`
  }, '')
}

function removeMature(content_filtered, type) {
  return content_filtered
    ? { query: `${type}.is_mature = FALSE`, op: 'AND' }
    : { query: '', op: '' }
}

function watchedEpisodes(user_id) {
  return `SELECT se.title series, COUNT(*) episodes
          FROM history h
          JOIN episodes e
          ON h.media_id = e.id
          JOIN seasons s
          ON e.series_id = s.series_id
          AND e.season_number = s.season_number
          JOIN series se
          ON s.series_id = se.id
          WHERE h.user_id = ${user_id}
          GROUP BY series`
}

function getSearch(sql, params) {
  const {
    category,
    filters,
    language,
    subtitles,
    id,
    content_filtered,
    newMedia,
  } = params

  const remainingEpisodes = filters.includes(REMAINING_EPISODES)
  const conds = getConds(params)
  const media = category === MOVIES ? getMovies(params) : getSeries(params)
  const ratings = getRatings(id, category)
  const filterMature = removeMature(
    content_filtered,
    category === MOVIES ? 'mo' : 'se'
  )

  const baseQuery = {
    locale: `SELECT * FROM locale l WHERE l.user_id = ${id}`,
    personnel: {
      actors: 'SELECT * FROM actors',
      directors: 'SELECT * FROM directors',
    },
    subscriptions: `SELECT * FROM subscriptions s WHERE s.user_id = ${id}`,
  }

  if (!conds.length) {
    const query = {
      ...baseQuery,
      media: `${media} ${ratings} ${
        filterMature.query ? `WHERE ${filterMature.query}` : ''
      }`,
    }

    return searchDatabase(sql, query)
  }

  const directors = filters.includes(DIRECTOR) ? GET_DIRECTORS : ''
  const actors = filters.includes(ACTOR) ? GET_ACTORS : ''
  const languages = language ? GET_AUDIO_LANGUAGES : ''
  const captions = subtitles ? GET_CAPTIONS : ''
  const statement = getWhereStatement(conds)
  const remaining = `SELECT w.series
                     FROM ((${GET_TOTAL_EPISODES_PER_SERIES}) t
                     JOIN (${watchedEpisodes(id)}) w
                     ON w.series = t.series)
                     WHERE t.episodes > w.episodes`
  const unwatched = `AND m.id NOT IN (
                     SELECT h.media_id id
                     FROM history h
                     WHERE h.user_id = ${id})`

  const query = {
    ...baseQuery,
    media: `${media} ${directors} ${actors} ${languages} ${captions} ${ratings} 
            WHERE ${remainingEpisodes ? `se.title = (${remaining}) AND` : ''} (${`${
      filterMature.query
    } ${filterMature.op}`} (${statement} 
            ${newMedia ? unwatched : ''}))`,
  }

  return searchDatabase(sql, query)
}

async function searchDatabase(sql, query) {
  const media = await sql.query(query.media)
  const actors = await sql.query(query.personnel.actors)
  const directors = await sql.query(query.personnel.directors)
  const locale = await sql.query(query.locale)
  const subscriptions = query.subscriptions
    ? await sql.query(query.subscriptions)
    : []

  return media.map(media => {
    // prettier-ignore
    const actorsByMedia = actors
      .filter(({ media_id }) => media_id === media.id)

    // prettier-ignore
    const directorsByMedia = directors
      .filter(({ media_id }) => media_id === media.id)

    // prettier-ignore
    const localeByMedia = locale
        .find(({ media_id }) => media_id === media.id)

    // prettier-ignore
    const subscribed = subscriptions
      .some(({ series_id }) => series_id === media.series_id)

    return {
      ...media,
      locale: localeByMedia || false,
      actors: actorsByMedia,
      directors: directorsByMedia,
      subscribed,
    }
  })
}

function getRatings(userId, category) {
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
    } m.id, mo.title, mo.genre, r.rating, m.category, mo.release_year
    FROM media m
    JOIN movies mo
    ON m.id = mo.id`
}

function getSeries({ language, subtitles }) {
  return `
  SELECT ${
    language || subtitles ? 'DISTINCT' : ''
  } m.id, e.title, se.title series, s.title season, se.genre, r.rating, m.category, e.release_year, se.id series_id, s.season_number
  FROM media m
  JOIN episodes e
  ON m.id = e.id
  JOIN seasons s
  ON e.series_id = s.series_id
  AND e.season_number = s.season_number
  JOIN series se
  ON s.series_id = se.id`
}

function updateDatabase(sql, params) {
  switch (params.type) {
    case HISTORY:
      updateHistory(sql, params)
      break
    case RATING:
      updateRatings(sql, params)
      break
    case SUBSCRIPTION:
      updateSubscriptions(sql, params)
      break
    case LANGUAGE:
      updateLanguages(sql, params)
      break
    case SUBTITLES:
      updateSubtitles(sql, params)
      break
    case MATURE_FILTER:
      updateMatureFilter(sql, params)
      break
    case CONTENT_FILTER:
      updateContentFilter(sql, params)
      break
  }
}

function updateHistory(sql, { media_id, user_id, seen }) {
  const query = seen
    ? `DELETE 
       FROM history h
       WHERE h.media_id = ${media_id} 
       AND h.user_id = ${user_id};
       DELETE
       FROM ratings r
       WHERE r.media_id = ${media_id} 
       AND r.user_id = ${user_id};
      `
    : `INSERT INTO
       history VALUES
       (${user_id}, ${media_id}, '${new Date()
        .toISOString()
        .substring(0, 10)}')   
      `

  sql.query(query)
}

function updateRatings(sql, { user_id, media_id, rating }) {
  const query = `INSERT INTO ratings
                 VALUES (${user_id}, ${media_id}, ${rating})
                 ON CONFLICT (user_id, media_id)
                 DO UPDATE
                 SET rating = ${rating}`

  sql.query(query)
}

function updateSubscriptions(sql, { user_id, series_id, subscribed }) {
  const query = subscribed
    ? `DELETE 
       FROM subscriptions s
       WHERE s.user_id = ${user_id} 
       AND s.series_id = ${series_id}`
    : `INSERT INTO subscriptions
       VALUES (${user_id}, ${series_id})`

  sql.query(query)
}

function updateLanguages(sql, { user_id, media_id, language }) {
  const query = `INSERT INTO locale
                 VALUES (${user_id}, ${media_id}, NULL, '${language}')
                 ON CONFLICT (user_id, media_id)
                 DO UPDATE
                 SET audio_language = '${language}'`

  sql.query(query)
}

function updateSubtitles(sql, { user_id, media_id, language }) {
  const query = `INSERT INTO locale
                 VALUES (${user_id}, ${media_id}, '${language}', NULL)
                 ON CONFLICT (user_id, media_id)
                 DO UPDATE
                 SET cc_language = '${language}'`

  sql.query(query)
}

function updateMatureFilter(sql, { user_id }) {
  const query = `UPDATE users
                 SET content_filtered = NOT content_filtered
                 WHERE id = ${user_id}`

  sql.query(query)
}

function updateContentFilter(sql, { user_id, category, val }) {
  const query = `DELETE FROM filters
                   WHERE user_id = ${user_id}
                   AND category = '${category}'`

  sql.query(query)

  if (val.length) {
    const values = val.reduce((filters, filter) => {
      return filter === val[val.length - 1]
        ? `${filters} (${user_id}, '${filter}', '${category}')`
        : `${filters} (${user_id}, '${filter}', '${category}'),`
    }, '')

    setTimeout(() => {
      const query = `INSERT INTO filters
                     VALUES ${values}`

      sql.query(query)
    }, 200)
  }
}
