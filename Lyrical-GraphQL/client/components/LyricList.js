import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class LyricList extends Component {
  // this is in an optimsitc response, because it takes time for out data to go to the back-end and back again to front-end,
  // there will always be a delay in showing the like numbers to fix that or make it more fluid we can user `optimisticResponse`
  // It simply expect that our query will success everytime and it will update our number before it gets the data from the server
  onLike(id, likes) {
    this.props.mutate({
      variables: { id },
      optimisticResponse: {
        __typename: 'Mutation',
        likeLyric: {
          id,
          __typename: 'LyricType',
          likes: likes + 1
        }
      }
    });
  }

  renderLyrics() {
    return this.props.lyrics.map(({ id, content, likes }) => {
      return (
        <li key={id} className="collection-item">
          {content}
          <div className="vote-box">
            <i
              className="material-icons"
              onClick={() => this.onLike(id, likes)}
            >
              thumb_up
            </i>
            {likes}
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className='collection'>
        {this.renderLyrics()}
      </ul>
    );
  }
}

const mutation = gql`
  mutation LikeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

export default graphql(mutation)(LyricList);
