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
  completedSeasons,
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
        completedSeasons={completedSeasons}
      />
    </Container>
  )
}

const Container = styled.div`
  padding: 2em;
`
