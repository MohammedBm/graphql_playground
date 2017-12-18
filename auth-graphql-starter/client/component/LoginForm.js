import React, { Component } from 'react';
import AuthFrom from './AuthForm'
import mutation from '../mutations/Login'
import { graphql } from 'react-apollo'

class LoginForm extends Component {
  onSubmit({ email, password }){
    this.props.mutate({
      variables: { email, password }
    })
  }

  render() {
    return (
      <div>
        <h3>Login</h3>
        <AuthFrom onSubmit={this.onSubmit.bind(this)} />
      </div>
    );
  }
}

export default LoginForm;