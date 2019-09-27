import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/auth.action';
class Header extends Component {
    constructor(props){
      super(props);
      this.handleLogout = this.handleLogout.bind(this);
      this.state = {};

    }

    handleLogout(e){
      e.preventDefault();
      this.props.logout();
    }
    render() {
        return (
            <header className="main-header">
                <Link to='/' className="logo">
                  <span className="logo-mini"><b>PM</b></span>
                  <span className="logo-lg" />
                </Link>

                <nav className="navbar navbar-static-top">
                    <a href="" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    {/*<!-- Navbar Right Menu -->*/}
                    <div className="navbar-custom-menu">
                      <ul className="nav navbar-nav">
                          <li className="dropdown user user-menu">
                              <a href="" className="dropdown-toggle" data-toggle="dropdown">
                                  <i className="fa fa-user"/>
                                  {this.props.user.name && `${this.props.user.name} ${this.props.user.surname}`}
                                  <span className="hidden-xs" />
                              </a>
                          </li>
                          <li>
                              <a onClick={this.handleLogout} className="bg_black_exit_a"><i className="fa fa-sign-out color_a_exit "/></a>
                          </li>
                      </ul>
                    </div>
                </nav>
            </header>
        );
    }
}
Header.propTypes = {
  auth: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { logout })(Header);
