import React, { Component } from 'react'
import AuthForm from './AuthForm'
import { graphql } from 'react-apollo'
import mutation from '../mutations/Signup'
import CurrentUserQuery from '../queries/CurrentUser'
import { hashHistory } from 'react-router'

class SignupForm extends Component {
  constructor(props) {
    super(props)

    this.state = { errors: [] }
  }

  componentWillUpdate(nextProps) {
    //this.props the old, current set of props
    //nextProps the next set of props whtat will be in place when the component rerenders
    if (nextProps.data.currentUser && !this.props.data.currentUser) {
      // redirect to dashboard
      hashHistory.push('/dashboard')
    }
  }

  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query: CurrentUserQuery }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message)
      this.setState({ errors })
    })
  }

  render() {
    return (
      <div>
        <h5>SignUp</h5>
        <AuthForm errors={this.state.errors} onSubmit={this.onSubmit.bind(this)} />
      </div>
    )
  }
}

export default graphql(CurrentUserQuery)(
  graphql(mutation)(SignupForm)
)
