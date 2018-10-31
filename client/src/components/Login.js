import React from 'react'
import styled from 'styled-components'

export default function Login({ setUser, users }) {
  return (
    <div>
      <h1 className="has-text-centered title is-1">Hi!</h1>
      <h3 className="has-text-centered title is-3">Who's watching?</h3>
      <Cards className="columns is-centered">
        {users.map(user => {
          const name = user.content_filtered ? `${user.name} 👶` : user.name
          return (
            <Card key={user.id} className="card" onClick={() => setUser(user)}>
              <div className="card-content">
                <p className="card-text is-centerered is-1">{name}</p>
              </div>
            </Card>
          )
        })}
      </Cards>
    </div>
  )
}

const Cards = styled.div`
  margin-top: 5em;
`

const Card = styled.div`
  cursor: pointer;
  transition: background 0.0125s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`
