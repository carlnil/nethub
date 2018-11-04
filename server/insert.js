const query = require('./query')
const { INSERT } = require('./constants')

function insertMovie(
  title,
  release_year,
  genre,
  directors,
  actors,
  prod_company,
  is_mature,
  languages,
  closed_captions
) {
  const id = Date.now()
  query(INSERT, {
    media: { id, category: 'movie' },
    movies: { id, prod_company, is_mature, title, release_year },
    directors,
    actors,
    languages,
    closed_captions,
  })
}
function insertEpisode(
  title,
  release_year,
  genre,
  directors,
  actors,
  prod_company,
  is_mature,
  languages,
  closed_captions,
  series,
  season
) {
  const id = Date.now()

  query(INSERT, {
    media: { id, category: 'episode' },
    movies: { id, prod_company, is_mature, title, release_year },
    directors,
    actors,
    languages,
    closed_captions,
    series,
    season,
  })
}

module.exports = {
  insertMovie,
  insertEpisode,
}
