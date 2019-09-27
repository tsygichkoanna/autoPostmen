import React from 'react';
import TextFieldGroupLogin from '../common/TextFieldGroupLogin';
import validateInput from '../../validations/login';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {login} from '../../actions/auth.action';
import {withRouter} from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
      resError: '',
      isLoading: false
    };
  }

  isValid() {
    const {errors, isValid} = validateInput(this.state);

    if (!isValid) {
      this.setState({errors});
    }

    return isValid;
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({errors: {}, resError: '', isLoading: true});
      const {email, password} = this.state;
      login({email, password})
        .then(this.props.login)
        .then(() => {
          this.props.history.push("/");
        })
        .catch((err) => {
          if(err.response && err.response.status === 401)
            this.setState({resError: 'Невірний логін або пароль', isLoading: false});
          else {
            this.setState(
              {
                resError: 'Помилка сервера. Перезагрузіть сторінку і спробуйте знову',
                isLoading: false}
                );
          }
        })
    }
    return false;
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  componentDidMount() {
    if (localStorage.jwtToken && this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }
  componentDidUpdate(){
    if (localStorage.jwtToken && this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const {errors, resError, email, password, isLoading} = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        {resError && <div className="alert alert-danger">{resError}</div>}

        <TextFieldGroupLogin
          field="email"
          icon="envelope"
          value={email}
          placeholder="Email"
          error={errors.email}
          onChange={this.onChange}
        />

        <TextFieldGroupLogin
          field="password"
          icon="lock"
          value={password}
          placeholder="password"
          error={errors.password}
          onChange={this.onChange}
          type="password"
        />

        <div className="btn_wrap clearfix">
          <button type="submit" className="btn btn-primary btn-block btn-flat" disabled={isLoading}>Вхід</button>
        </div>
        {isLoading && <i className="fa fa-spinner fa-spin fa-2x loading-login" />}
      </form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
};

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    login: (action) =>{
      dispatch(action);
    }
  }))(LoginForm));
