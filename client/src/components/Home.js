import React, { Component } from 'react'
import { Checkbox, CheckboxGroup } from 'react-checkbox-group'
import styled from 'styled-components'

const ratings = [5, 4, 3, 2, 1]

const radios = [
  { val: 'movies', type: 'Movies' },
  { val: 'series', type: 'TV shows' },
]
const checkboxes = [
  'Name',
  'Genre',
  'Remaining episodes',
  'Language',
  'Actor',
  'Director',
]

function mapMedia(media) {
  return media.map(media => {
    const title = media.is_mature ? `${media.title} 🔞` : media.title
    const rating = `${media.rating}/5`

    return (
      <div key={media.id}>
        <h2>{title}</h2>
        <h2>{media.series}</h2>
        <h3>{media.title}</h3>
        <h5>{media.season}</h5>
        <h4>Rating: {rating}</h4>
        <hr />
        <br />
      </div>
    )
  })
}

export default class Home extends Component {
  state = {
    radio: 'movies',
    rating: '',
    categories: ['Name'],
  }

  handleRadioChange = ({ target: { value: radio } }) => {
    this.setState({ radio })
  }

  handleRatingChange = ({ target: { value: rating } }) => {
    this.setState({ rating })
  }

  handleCheckboxChange = categories => {
    this.setState({ categories })
  }

  render() {
    const { onSearch, media, user } = this.props
    const { categories } = this.state
    const { handleRadioChange, handleRatingChange, handleCheckboxChange } = this

    return (
      <Container>
        <Form
          className="form-group"
          onSubmit={e => onSearch(e, user, this.state)}
        >
          <Searchbar
            type="text"
            className="form-control"
            placeholder="Search for your favorite movies and shows!"
          />
          <Button className="btn btn-primary">
            <span role="img" aria-label="search">
              🔎
            </span>
          </Button>
        </Form>
        <h5>Filter by</h5>
        <Radios>
          {radios.map(({ val, type }) => (
            <label key={val}>
              <div className="form-check">
                <input
                  name="content_type"
                  className="form-check-input"
                  type="radio"
                  value={val}
                  defaultChecked={val === 'movies'}
                  onChange={handleRadioChange}
                />
                {type}
              </div>
            </label>
          ))}
        </Radios>
        <div>
          <label>Rating</label>
          <br />
          <Select className="form-control" onChange={handleRatingChange}>
            <option defaultValue value={0}>
              -
            </option>
            {ratings.map(rating => (
              <option key={rating}>{rating}</option>
            ))}
          </Select>
        </div>
        <Checkboxes
          value={categories}
          onChange={handleCheckboxChange}
          checkboxDepth={2}
        >
          {checkboxes.map(category => (
            <label key={category}>
              <Checkbox value={category} /> {category}
            </label>
          ))}
        </Checkboxes>
        {mapMedia(media)}
      </Container>
    )
  }
}

const Container = styled.div`
  padding: 2em;
`

const Form = styled.form`
  display: flex;
  width: 40%;
  transition: filter 0.125s ease-in-out;
`

const Searchbar = styled.input`
  font-size: 1.5rem;
  padding: 1em 0 1em 0.5em;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const Button = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const Radios = styled.div`
  display: flex;

  * {
    padding-right: 0.5em;
  }
`

const Select = styled.select`
  width: 5em;
`

const Checkboxes = styled(CheckboxGroup)`
  padding-top: 1.5em;

  * {
    padding-right: 0.5em;
  }
`
