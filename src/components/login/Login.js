import React, { Component } from 'react';

import logo from '../../logo.png';
import LoginForm from './LoginForm'
import { Link } from 'react-router-dom';

class Login extends Component {
    render() {
        return (
            <div className="login-box_wrap">
              <div className="login-box">
                  <div className="login-logo">
                      <a href="/"><img src={logo} className="logo" alt="Postman" /></a>
                  </div>
                  <div className="login-box-body">
                      <p className="login-box-msg">Вхід</p>
                      <LoginForm />
                      {/* end login form */}
                      <Link to='/reset-password' className="forgotPass">Забули пароль?</Link>
                  </div>
              </div>
            </div>
        );
    }
}

export default Login;
