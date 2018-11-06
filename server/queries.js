module.exports = {
  GET_USERS: `
    SELECT * 
    FROM users`,
  GET_LANGUAGES: `
    SELECT al.language, m.category, al.media_id
    FROM audio_languages al
    JOIN media m
    ON al.media_id = m.id`,
  GET_SUBTITLES: `
    SELECT cc.language, m.category, cc.media_id
    FROM closed_captions cc
    JOIN media m
    ON cc.media_id = m.id`,
  GET_MOVIE_HISTORY: `
    SELECT h.media_id id, m.title, r.rating, m.genre, h.date
    FROM history h
    JOIN movies m 
    on h.media_id = m.id
    FULL OUTER JOIN ratings r
    ON h.user_id = r.user_id 
    AND h.media_id = r.media_id`,
  GET_SERIES_HISTORY: `
    SELECT h.media_id id, e.title, s.title season, se.title series, s.season_number, s.episode_count, r.rating, se.genre, h.date, s.series_id
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
    AND h.media_id = r.media_id`,
  GET_DIRECTORS: `
    JOIN directors d
    ON m.id = d.media_id`,
  GET_ACTORS: `
    JOIN actors a
    ON m.id = a.media_id`,
  GET_AUDIO_LANGUAGES: `
    JOIN audio_languages al
    ON m.id = al.media_id`,
  GET_CAPTIONS: `
    JOIN closed_captions cc
    ON m.id = cc.media_id`,
  GET_CHILDREN: `
    SELECT *
    FROM children`,
  GET_FILTERS: `
    SELECT *
    FROM filters`,
  GET_TOTAL_EPISODES_PER_SERIES: `
    SELECT se.title series, SUM(s.episode_count) episodes
    FROM seasons s
    JOIN series se
    ON se.id = s.series_id
    GROUP BY se.title`,
}
