import React, {Component} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import TextFieldGroup from '../common/TextFieldGroup';
import { Button, Overlay } from 'react-bootstrap';
import { validateProjectForm } from '../../validations/clients';
import Select from 'react-select';
import {
    addProject,
    addNewProject,
    delProject,
    delClient,
    getAllClients,
    getDirectionsAndDepartments
} from '../../actions/client.action';


export class AddItemPopover extends Component {
  render () {
      const { errors, name, department, departmentsOptions, errProj } = this.props;
      return (
        <div className="popover_wrap_add">
          <form>
            { errProj && <div className="alert alert-danger">{errProj}</div> }
            <TextFieldGroup
              field="name"
              label="Назва"
              value={name}
              error={errors.name}
              onChange={this.props.handleOnChange}
            />
            {/*<div className={classnames('form-group', { 'has-error': errors.department })}>*/}
              {/*<label>Відділ</label>*/}
              {/*<Select*/}
              {/*name="department"*/}
              {/*onChange={this.props.handleSelectChange}*/}
              {/*options={departmentsOptions}*/}
              {/*placeholder="Відділ"*/}
              {/*simpleValue*/}
              {/*value={department}*/}
              {/*/>*/}
              {/*{errors.department && <span className="help-block">{errors.department}</span>}*/}
            {/*</div>*/}
          <Button type="submit" onClick={this.props.handleOnSubmit} bsClass="btn btn-primary" >Додати</Button>
          </form>
        </div>
      );
  }
}

export class DeleteItemPopover extends Component{
  render(){
    return(
      <div className="popover_wrap">
        <Button type="submit" bsClass="btn btn-danger" onClick={this.props.handleDeleteItem}>Видалити</Button>
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
      name: '',
      errProj: this.props.errProj,
      department: '',
      departmentLabel: '',
      departmentsOptions: [],
    }

  }

  componentDidMount(){
      if(this.props.type === 'add'){

          //Loader (start)
          this.props.setLoading(true);

          this.props.getDirectionsAndDepartments(this.props.setLoading).then(
              () => {
                  this.props.departmens_directions.department.forEach((el)=>{
                      let department = {};
                      department.value = el.id;
                      department.label = el.name;
                      this.setState({departmentsOptions: this.state.departmentsOptions.concat(department)})
                  })
              }
          );
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.triggerPopover !== this.props.triggerPopover){
      this.setState({show: nextProps.triggerPopover})
    }
  }
  // methods
  toggle = () => {
    this.setState({ show: !this.state.show });
  };
  handleClose = () => {
    this.setState({ show: false});
  };
  isValid = () => {
    const { errors, isValid } = validateProjectForm(this.state.name, this.state.department);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSelectChange = (value) => {
    if (value !== null) {
      const newDep = this.props.departmens_directions.department.filter((dep)=> dep.id === value);
      this.setState({ department: value, departmentLabel: newDep[0].name });
    }else {
        this.setState({department : '' , departmentLabel:''})
    }
  };
  handleOnSubmit = (e) => {
    e.preventDefault();
    if (this.isValid()){
      this.setState({ errors: ''});
      let data = [{'name': this.state.name,
        'department': {id: this.state.department, name: this.state.departmentLabel}
    }]
      this.props.addProject(data);
      this.props.addNewProject(data);
      this.setState({ name: '', department: '', errProj: ''});
      this.handleClose();
    }
  }
  handleDeleteProj = (e) => {
    e.preventDefault();
    if(this.props.data_id){
      this.props.delProject(this.props.data_name);
      this.handleClose();
    }else{
      this.props.delProject(this.props.data_name);
      this.handleClose();
    }
  }
  handleDeleteClient = (e) => {
    e.preventDefault();
    this.props.delClient(this.props.data_id).then(
      (res) => {
        this.props.getAllClients(this.props.setLoading);
        this.handleClose();
      },
      // TODO: (err) =>  err handle
    )
  }
  // ..methods

  render() {

    let Content;
    let Trigger;
    switch (this.props.type) {
      case 'add':
        Trigger =
          <a className="btn btn-primary" onClick={this.toggle}>
            <i className="fa fa-plus" aria-hidden="true"/>
          </a>;
        Content =
          <AddItemPopover
            handleOnChange={this.handleOnChange}
            handleSelectChange={this.handleSelectChange}
            handleOnSubmit={this.handleOnSubmit}
            {...this.state}
          />;
        break;
      case 'delProj':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-trash" aria-hidden="true" />
          </a>;
        Content =
          <DeleteItemPopover
              handleDeleteItem={this.handleDeleteProj}
              handleClose={this.handleClose}
          />;
        break;
      case 'delClient':
        Trigger =
          <a className="btn btn-primary btn-delete" onClick={this.toggle}>
            <i className="fa fa-trash" aria-hidden="true" />
          </a>;
        Content =
          <DeleteItemPopover
              handleDeleteItem={this.handleDeleteClient}
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
  return{
      jobs: state.position.jobs,
      departmens_directions: state.client.departmens_directions
  }
};
const mapDispatchToProps = dispatch => {
    return {
        addProject                  : loader => dispatch(addProject(loader)),
        addNewProject               : loader => dispatch(addNewProject(loader)),
        delProject                  : loader => dispatch(delProject(loader)),
        delClient                   : loader => dispatch(delClient(loader)),
        getAllClients               : loader => dispatch(getAllClients(loader)),
        getDirectionsAndDepartments : loader => dispatch(getDirectionsAndDepartments(loader)),
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(PopoverForm);
