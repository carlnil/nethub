import React from 'react'
import styled from 'styled-components'

export default function Media({ media }) {
  return (
    <Container>
      {media.map(media => {
        const title = media.is_mature ? `${media.title} 🔞` : media.title
        const rating = media.rating ? `${media.rating}/5` : '-'

        return (
          <div key={media.id}>
            <h4 className="title is-4">{title}</h4>
            <h4 className="title is-4">{media.series}</h4>
            <h6 className="title is-6">{media.season}</h6>
            <h6 className="title is-6">Genre: {media.genre}</h6>
            <h5 className="title is-5">Rating: {rating}</h5>
            <hr />
            <br />
          </div>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  overflow-y: scroll;
  max-height: 90vh;
`
