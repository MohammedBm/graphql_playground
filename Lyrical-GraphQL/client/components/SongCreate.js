import React, { Component } from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Link, hashHistory } from 'react-router'
import query from '../queries/fetchSong'

class SongCreate extends Component {
  constructor(props){
    super(props)

    this.state = { title: '' }
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: { title: this.state.title },
      refetchQueries: [{ query }]
    }).then(() => hashHistory.push('/'))
  }

  render() {
    return (
      <div>
        <Link to='/'>Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)} >
          <label>Song Title:</label>
          <input
            onChange={ event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

// our title, Here will need to get a new title everytime the user submits a song
// on our mutation we are passing a title,  not like `graphiql where we hard code
// to do that we can user these .
// in the mutation argument we the name of pramater start with $ likse `$title: String` the type stays without a dollar sign
  // inside the mutation body the name of the pramater is without a dollar sign, like this `title: $String` the type of the title takes the dollar sign this time
const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title){
      title
    }
  }
`

export default graphql(mutation)(SongCreate);


