import React, {Component} from 'react';
import { connect } from 'react-redux';

import { Button, Overlay } from 'react-bootstrap';
import { archiveUser, delUser, getAllUsers } from '../../actions/users.action';

export class UserActionPopover extends Component{
  render(){
    return(
      <div className="popover_wrap">
        <Button type="submit" bsClass="btn btn-danger" onClick={this.props.handleSubmit}>{this.props.submitText}</Button>
        <Button type="reset" onClick={this.props.handleClose} bsClass="btn btn-discard">Відмінити</Button>
      </div>
    );
  }
}

class PopoverForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: this.props.triggerPopover,
      errors: '',
      errProj: this.props.errProj
    }

  }


  // methods
  toggle = () => {
    this.setState({ show: !this.state.show });
  }
  handleClose = () => {
    this.setState({ show: false});
  }

  handleDeleteUser = (e) => {
    e.preventDefault();
    const setLoading =  this.props.setLoading;
    this.props.delUser(this.props.data_id,setLoading)
      .then((res) => {
        this.props.getAllUsers(setLoading);
        this.handleClose();
      },
      // TODO: (err) =>  err handle
    )
    .then(()=> this.props.action(this.props.data_id))
  }

  handleArchiveUser = (e) => {
    e.preventDefault();
    const setLoading =  this.props.setLoading;
    
    this.props.archiveUser(this.props.data_id,setLoading)
      .then((res) => {
        this.props.getAllUsers(setLoading);
        this.handleClose();
      }
    )
    .then(()=> this.props.action(this.props.data_id))
  }

  render() {

    let Content;
    let Trigger;

    const { type } = this.props;

    switch (type) {

      case 'delUser':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-trash" aria-hidden="true" />
          </a>;
        Content =
          <UserActionPopover
            submitText='Видалити'
            handleSubmit={this.handleDeleteUser}
            handleClose={this.handleClose}
          />;
        break;
      case 'archiveUser':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-archive" aria-hidden="true" />
          </a>;
        Content =
          <UserActionPopover
            submitText='Архивировать'
            handleSubmit={this.handleArchiveUser}
            handleClose={this.handleClose}
          />;
        break;
      default:

    }
    return (
      <div style={{ position: 'relative' }}>

        {Trigger}

        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="top"
          container={this}
          rootClose={true}
        >

          {Content}

        </Overlay>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      jobs: state.position.jobs,
      departmens_directions: state.client.departmens_directions
  }
};
const mapDispatchToProps = dispatch => {
  return {
      archiveUser : (id,loader) => dispatch(archiveUser(id,loader)),
      delUser     : (id,loader) => dispatch(delUser(id,loader)),
      getAllUsers : (loader) => dispatch(getAllUsers(loader))
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(PopoverForm);
