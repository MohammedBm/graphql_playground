const graphql = require('graphql')
// const _ = require('lodash')  ==>  we will not loadsh library since we are not going with static data
const axios = require('axios')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

// we wont need this static list of users anymore since we are going to use our outside
// to fetch data.
// we can use regular http fetch, or use axios.
// axios is a library that help making http requests
// const users = [
//   {id: '37', firstName: 'Dr.Mundo', age: 20},
//   {id: '23', firstName: 'Se7o', age: 43},
// ]

// the order of defention is important.
// Team defeintion, this secify the columns we have on our `Team` table
const TeamType = new GraphQLObjectType ({
  name: 'Team',
  fields: () => ( {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // we will get error now because the UserType is undefined. since the `UserType` is defined later. to fix that we will need to change the fileds variable into arrow funciton
      resolve( parentValue, args ) {
        return axios.get(`http://localhost:3000/teams/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
})

// user defeintion, this secify the columns we have on our `User` table
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    team: { //this is equal to `teamId`. To get the id of the team we will need to user the resolve function
      // this will relate the users to team (associate with its)
      type: TeamType,
      resolve(parentValue, args) { //this is the resolve function that will get us the team id
        return axios.get(`http://localhost:3000/teams/${parentValue.teamId}`) // with this fetch we will get all the information we need about the team
          .then(res => res.data);
      }
    }
  })
})

// RootQuery allows graphQL to access into the application data graph
// for example if we want to acess a user with id of '37' we could write this query
// {
//   user(id: "37"){
//     firstName
//     id
//     age
//   }
// }
// this will give us the the user with id 37 with its username, id, and age.
// If we want to fetch another user we just need to change the "id".
// Also we can  change the proprties we get from the query. we can rmove the id and age
// if we want to get the firstname only. This give us the ability to get what we need
// instead of getting unnecessary data from the databse we have

// graphql work as a proxy to fetch data from different sources and pull them to togethere.
// For example it can go and hit the first server database and get the information it needed.
// In the same time it can hit another API to get more data, and it can go to  a second database
// and get more information from there. It can get get howevery many outside soruces it need and send
// iit back as a respone as graphQL query.

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      //because we are using promise we can fetch any piece of data using resolve
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(resp => resp.data);
      }
    },
    team: {
      type: TeamType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/teams/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

// very similar to a regular query, but mutaions edit the table we already have, for example add new user or delete user.
const mutation = new GraphQLObjectType ({
  name: 'Mutation',
  fields: {
    // this mutation 👇 will add a user to the users collection
    addUser: {
      type: UserType,
      // when we send information or create a user we expect to have  firstname, age and teamId
      args: {
      // it dosent make sense if we dont have a  user firstName, or age so we need to add some level of validation, to add that level of validation we will user `GraphQLNonNull`
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        teamId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post('http://localhost:3000/users', { firstName, age, })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      // we are getting the id 👇 since we need to sprcify what user we want to delete and the best way to do that is by having the id of the user
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data)
      }
    },
    // this is the edit mutation, we can edit the user informaiton by using this
    editUser: {
      type: UserType,
      args: {
        // we will need the id everytime since we need to specify which user to edit
        // anyhing else is optinal since its not necessary to edit.
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        teamId: { type: GraphQLString }
      },
      resolve(parentValue, args ) {
        // we will give our axois call the id on http request, and anything we edited after that
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data)
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})