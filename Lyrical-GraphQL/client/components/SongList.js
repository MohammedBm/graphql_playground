import React from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Link } from 'react-router';

// there is a list of straregy we can use when we try to add graphQL to React
// 1. Identify data required
// 2. Write query in Graphiql (for parctice) and in component file
// 3. Bond query + component
// 4. Acess data!

/* 1. for this componenet we will need this query
{
	songs {
    title
  }
}
this query above will give us only the title which is
the only thing we need in the SongList component

Also Queryes are not valid javascript code so we cannot write the query directly
inside our components. To write queries inside component file we can use `graphql-tag`
to write our queries directly into our javascript files
*/

class SongList extends React.Component {

  // this `renderSongs` helper will put our songs on the screen using the `.map` method
  // which map every song inside our `data.songs`. Also we need to fetch id with our title
  // to satisfy react, since it require id for each elemnts of any kind of array
  renderSongs() {
    return this.props.data.songs.map( song => {
      return (
        // we are importing Matrlize.CSS 👇
        <li key={song.id} className='collection-item'>
          {song.title}
        </li>
      )
    })
  }

  render() {
    if (this.props.data.loading) { return <div>Loading...</div>}

    return (
      <div>
        <ul className='collection'>
          {this.renderSongs()}
        </ul>
        <Link to="/songs/new" className="btn-floating btn-large red right">
            <i className="material-icons">add</i>
        </Link>
      </div>
    )
  }

}

/*
  2. here is our query we wrote down using the `graphql-tag` which giv us the
  ability to write down query into our components
*/
const query = gql`
	{
		songs {
      id
			title
		}
	}
`;

// this is the graphql that we imported from `react-apollol`. It looks very similar to redux.
// this below bond our query to our Songlist component
export default graphql(query)(SongList);