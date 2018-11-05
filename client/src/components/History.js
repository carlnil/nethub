import React from 'react'
import styled from 'styled-components'
import Media from './Media'

export default function History({
  history,
  onHistoryChange,
  onRatingChange,
  onLanguageChange,
  onSubtitlesChange,
  onSubscriptionChange,
  languages,
  subtitles,
}) {
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
