import React, { useEffect } from 'react'
import styled from 'styled-components'
import {
  NAME,
  EMAIL,
  NUMBER,
  PAYMENT_STATUS,
  BIRTH_DATE,
  CREATION_DATE,
  EXPIRATION_DATE,
} from '../constants'
import FilterSelection from './utility/FilterSelection'

export default function Settings({
  user,
  handleFilterChange,
  handleFilterSelection,
  metadata,
  handleSettings,
}) {
  useEffect(() => {
    handleSettings()
  }, [])
  return (
    <Container>
      <h3 className="title is-3">User</h3>
      {basicInfo(
        user,
        handleFilterChange,
        handleFilterSelection,
        metadata,
        Date.now() - new Date(user.birth_date) < 568025136000
      )}

      <br />
      <hr />
      <h3 className="title is-3">Children</h3>
      <br />
      {user.children.map(child => (
        <div key={child.id}>
          <h4 className="title is-4">{child.name}</h4>
          {basicInfo(
            child,
            handleFilterChange,
            handleFilterSelection,
            metadata
          )}
          <hr />
        </div>
      ))}
    </Container>
  )
}

const basicInfo = (
  user,
  handleFilterChange,
  handleFilterSelection,
  metadata,
  disabled = false
) => {
  const info = [
    { type: NAME, val: user.name },
    { type: EMAIL, val: user.email },
    { type: NUMBER, val: user.number },
    { type: PAYMENT_STATUS, val: String(user.payment_status) },
  ]

  const dates = [
    { type: BIRTH_DATE, val: user.birth_date },
    { type: CREATION_DATE, val: user.creation_date },
    { type: EXPIRATION_DATE, val: user.expiration_date },
  ]

  return (
    <div>
      {info.map(({ type, val }) => (
        <h4 key={type} className="title is-4">
          {type}: <span className="subtitle">{val}</span>
        </h4>
      ))}

      <h4 className="title is-4">
        Mature Filter:{' '}
        <input
          type="checkbox"
          onChange={() => handleFilterChange(user)}
          defaultChecked={user.content_filtered}
          disabled={disabled}
        />
      </h4>

      {dates.map(({ type, val }) => (
        <h4 key={type} className="title is-4">
          {type}{' '}
          <span className="subtitle">{new Date(val).toLocaleDateString()}</span>
        </h4>
      ))}

      <h3 className="title is-3">Filter based on...</h3>
      {metadata.map(({ category, list }) => {
        return (
          <div key={category}>
            <h4 className="title is-4">... {category}</h4>
            <FilterSelection
              disabled={disabled}
              activeFilters={user.contentFilters[category]}
              categories={list}
              onSelection={val => handleFilterSelection(user, category, val)}
            />
            <br />
          </div>
        )
      })}
    </div>
  )
}

const Container = styled.div`
  padding: 2em;
`
