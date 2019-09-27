import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getUserInfo} from '../../actions/users.action';
import EditUserForm from './AddUser';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }

  componentDidMount = () => {
    this.props.setLoading(true);
    getUserInfo(this.props.match.params.id)
      .then((res) => {
        this.setState({user: res.data});
        this.props.setLoading(false)
      })
      .catch(console.error);
  };

  render() {
    return (
      this.state.user &&
      <EditUserForm
        userId={this.props.match.params.id}
        user={this.state.user}
        setLoading={this.props.setLoading}
        setSuccess={this.props.setSuccess}
        setError={this.props.setError}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    user_info: state.user.user
  }
};


export default withRouter(connect(mapStateToProps)(EditUser))
