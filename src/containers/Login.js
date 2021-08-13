import React, { Component } from 'react';
import Login from '../components/Login';

class LoginContainer extends Component {
  render() {
    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-7 col-xl-5">
              <div className="fdb-box fdb-touch">
                <h1 className="text-center">Login</h1>
                <Login handleLogin={this.props.handleLogin} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default LoginContainer;
