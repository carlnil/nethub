module.exports = {
  GET_USERS: `SELECT * 
              FROM users`,
  GET_LANGUAGES: `SELECT al.language, m.category, al.media_id
                  FROM audio_languages al
                  JOIN media m
                  ON al.media_id = m.id`,
  GET_SUBTITLES: `SELECT cc.language, m.category, cc.media_id
                  FROM closed_captions cc
                  JOIN media m
                  ON cc.media_id = m.id`,
  GET_MOVIE_HISTORY: `SELECT h.media_id id, m.title, r.rating, m.genre, h.date
                      FROM history h
                      JOIN movies m 
                      on h.media_id = m.id
                      FULL OUTER JOIN ratings r
                      ON h.user_id = r.user_id 
                      AND h.media_id = r.media_id`,
  GET_SERIES_HISTORY: `SELECT h.media_id id, m.title, s.title season, se.title series, r.rating, se.genre, h.date
                       FROM history h
                       JOIN episodes m
                       ON h.media_id = m.id
                       JOIN seasons s
                       ON m.season_number = s.season_number
                       AND m.series_id = s.series_id
                       JOIN series se
                       ON s.series_id = se.id
                       FULL OUTER JOIN ratings r
                       ON h.user_id = r.user_id 
                       AND h.media_id = r.media_id`,
  GET_HISTORY_COUNT: `SELECT COUNT(*)
                      FROM history h
                      JOIN episodes e
                      ON h.media_id = e.id
                      JOIN seasons s
                      ON e.series_id = s.series_id
                      AND e.season_number = s.season_number
                      JOIN series se
                      ON s.series_id = se.id`,
  GET_DIRECTORS: `JOIN directors d
                  ON m.id = d.media_id`,
  GET_ACTORS: `JOIN actors a
               ON m.id = a.media_id`,
  GET_AUDIO_LANGUAGES: `JOIN audio_languages al
                        ON m.id = al.media_id`,
  GET_CAPTIONS: `JOIN closed_captions cc
                 ON m.id = cc.media_id`,
}