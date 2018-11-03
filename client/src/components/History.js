import React, { useEffect } from 'react'
import styled from 'styled-components'
import Media from './Media'
import { HISTORY } from '../constants'

export default function History({ onHistory, history, user, page }) {
  useEffect(() => onHistory({ id: user.id }), [page === HISTORY])
  return (
    <Container>
      <Media media={history} filter={false} />
    </Container>
  )
}

const Container = styled.div`
  padding: 2em;
`
