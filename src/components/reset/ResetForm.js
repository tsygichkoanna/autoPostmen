import React from 'react';
import TextFieldGroupLogin from '../common/TextFieldGroupLogin';
import validateEmail from '../../validations/reset';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset } from '../../actions/resetPass.action';

class ResetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
      resError: '',
      isLoading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateEmail(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, resError: '', isLoading: true });
      reset(this.state.email)
        .then(() => this.context.router.history.push('/login'))
        .catch((err) => {
          this.setState({ resError: err.response.data.error, isLoading: false })
        })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, resError, email, isLoading } = this.state;

    return (
      <form onSubmit={this.onSubmit}>

        { resError && <div className="alert alert-danger">{resError}</div> }

        <TextFieldGroupLogin
          field="email"
          icon="envelope"
          value={email}
          placeholder="Email"
          error={errors.email}
          onChange={this.onChange}
        />

        <div className="btn_wrap clearfix">
          <button type="submit" className="btn btn-primary btn-block btn-flat" disabled={isLoading}>Відправити пароль</button>
        </div>
      </form>
    );
  }
}

ResetForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, {  })(ResetForm);
