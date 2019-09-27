import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {validateInfoForm} from '../../validations/info';
import Title from '../Title';
import TextFieldGroup from '../common/TextFieldGroup';
import { updateInfo } from '../../actions/users.action';
import { logout, getCurrentUser as getCurrentUserAction } from '../../actions/auth.action';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    const { name, surname, email } = props.user;
    this.state = {
      title: "Редагувати мої дані",
      resError: '',
      errors: '',
      name: name || '',
      surname: surname || '',
      email: email|| '',
      password: '',
      secondPassword: '',
      isSuccessful: false,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.user.hasOwnProperty('name')){
      const { name, surname, email } = nextProps.user;
      this.setState({name, surname, email});
    }
  }

  isValid() {
    const data = {
      ...this.state
    };

    const {errors, isValid} = validateInfoForm(data);
    if (!isValid) {
      this.setState({errors});
    }

    return isValid;
  }

  inputHandleOnChange = (e) => {
    this.setState({[e.target.name] : e.target.value});
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.isValid()) {

      this.setState({errors: {}, resError: '', isLoading: true});

      const data = {
        email: this.state.email,
        name: this.state.name,
        surname: this.state.surname,
        password: this.state.password,

      };
      updateInfo(data)
        .then((res) => {
            this.setState({isSuccessful: true, isLoading: false});
            setTimeout(()=>{
                this.setState({isSuccessful: false});
            }, 1000);
            localStorage.setItem('jwtToken', res.data.token);
            this.props.getCurrentUser();
          },
          (err) => {
            this.setState({resError: err.response.data.error, isLoading: false})
          }
        );
    }
  };


  // ..methods
  render() {
    const { name, surname, email, resError, errors, secondPassword, password, isSuccessful } = this.state;
    return (
      <section className="addUser_wrap">
        <Title title={this.title}/>
        <div className="form_wrap">
          <form onSubmit={this.onSubmit}>
            {resError && <div className="alert alert-danger">{resError}</div>}
            {isSuccessful && <div className="alert alert-success">Дані збережені</div>}
            <TextFieldGroup
              field="name"
              label="Ім’я"
              value={name}
              error={errors.name}
              onChange={this.inputHandleOnChange}
              //
            />

            <TextFieldGroup
              field="surname"
              label="Прізвище"
              value={surname}
              error={errors.surname}
              onChange={this.inputHandleOnChange}
            />
            <TextFieldGroup
              field="email"
              label="Email"
              value={email}
              error={errors.email}
              onChange={this.inputHandleOnChange}
            />

            <TextFieldGroup
              field="password"
              label="Новий пароль"
              value={password}
              type="password"
              error={errors.password}
              onChange={this.inputHandleOnChange}
            />
            <TextFieldGroup
              field="secondPassword"
              label="Пiдтвердити пароль"
              type="password"
              value={secondPassword}
              error={errors.secondPassword}
              onChange={this.inputHandleOnChange}
            />
            <input id="save" type="submit" value="Зберегти" className="btn btn-primary"/>
          </form>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
      user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
      logout : loader => dispatch(logout(loader)),
      login: (action) =>{
        dispatch(action);
      },
      getCurrentUser: () => dispatch(getCurrentUserAction)
  }
};
//

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(UserInfo));
