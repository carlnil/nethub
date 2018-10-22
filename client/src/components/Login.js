import React from 'react'
import styled from 'styled-components'

export default function Login({ loginUser, users }) {
  return (
    <div>
      <h1 className="text-center mt-5">Hi!</h1>
      <h3 className="text-center mt-5 font-weight-light">Who's watching?</h3>
      <Line />
      <Cards>
        {users.map(user => {
          const name = user.content_filtered
            ? `${user.name} 👶`
            : user.name

          return (
            <Card
              key={user.id}
              className="card"
              onClick={() => loginUser(user)}
            >
              <div className="card-body">
                <p className="card-text text-center font-weight-bold">
                  {name}
                </p>
              </div>
            </Card>
          )
        })}
      </Cards>
    </div>
  )
}

const Line = styled.hr`
  width: 25%;
`

const Cards = styled.div`
  display: flex;
  padding: 2em;
  justify-content: center;
`

const Card = styled.div`
  margin: 1em;
  width: 10em;
  box-shadow: 0px 2.5px 5px rgb(70, 70, 70);
  transition: box-shadow 0.125s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 3.5px 5px rgb(60, 130, 151);
  }
`
