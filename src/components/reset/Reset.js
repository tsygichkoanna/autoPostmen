import React, { Component } from 'react';
// 
import ResetForm from './ResetForm'

class Reset extends Component {
    render() {
        return (
          <div className="login-box_wrap">
              <div className="login-box">

                  <div className="reset-box-body">
                      <p className="reset-box-msg">Відновити пароль</p>
                      <ResetForm/>
                  </div>
              </div>
            </div>
        );
    }
}

export default Reset;
