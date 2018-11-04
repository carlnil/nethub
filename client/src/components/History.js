import React, { useEffect } from 'react'
import styled from 'styled-components'
import Media from './Media'
import { HISTORY } from '../constants'

export default function History({
  onHistory,
  history,
  user,
  page,
  onHistoryChange,
  onRatingChange,
  onLanguageChange,
  onSubtitlesChange,
  onSubscriptionChange,
  languages,
  subtitles,
}) {
  useEffect(() => onHistory({ id: user.id }), [page === HISTORY, history])

  return (
    <Container>
      <Media
        media={history}
        history={history}
        filter={false}
        onHistoryChange={onHistoryChange}
        onRatingChange={onRatingChange}
        onLanguageChange={onLanguageChange}
        onSubtitlesChange={onSubtitlesChange}
        onSubscriptionChange={onSubscriptionChange}
        languages={languages}
        subtitles={subtitles}
      />
    </Container>
  )
}

const Container = styled.div`
  padding: 2em;
`
