import React from 'react'
import styled from 'styled-components'
import { MOVIE, MOVIES, EPISODE, SERIES } from '../constants'

export default function Media({ media, category }) {
  return (
    <Container>
      <h3 className="title is-3">
        Watch these unseen {category === MOVIES ? 'movies' : 'episodes'}!
      </h3>
      <br />
      {media.map(media => {
        const title = media.is_mature ? `${media.title} 🔞` : media.title
        const rating = media.rating ? `${media.rating}/5` : '-'
        return media.category === MOVIE && category === MOVIES ? (
          <div key={media.id}>
            <h4 className="title is-4">{title}</h4>
            <h6 className="title is-6">Genre: {media.genre}</h6>
            <h5 className="title is-5">Rating: {rating}</h5>
            <hr />
            <br />
          </div>
        ) : media.category === EPISODE && category === SERIES ? (
          <div key={media.id}>
            <h4 className="title is-4">{title}</h4>
            <h4 className="title is-4">{media.series}</h4>
            <h6 className="title is-6">{media.season}</h6>
            <h6 className="title is-6">Genre: {media.genre}</h6>
            <h5 className="title is-5">Rating: {rating}</h5>
            <hr />
            <br />
          </div>
        ) : (
          false
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  overflow-y: scroll;
  max-height: 90vh;
`
