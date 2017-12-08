import React from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

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
  render() {
    console.log(this.props)

    return (
      <p>
        SongList
      </p>
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
			title
		}
	}
`;

// this is the graphql that we imported from `react-apollol`. It looks very similar to redux.
// this below bond our query to our Songlist component
export default graphql(query)(SongList);