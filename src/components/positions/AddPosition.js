import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {editPosition, getAllDepartments} from '../../actions/positions.action';
import {validatePositionForm} from '../../validations/positions';
import PositionForm from './PositionForm';

class AddPosition extends Component {
  constructor(props) {
    super(props);

    const {department, name, works} = props;
    const departmentID = department && department._id;
    this.state = {
      works : works || [],
      errors: '',
      resError: '',
      department: departmentID || '',
      positionName: name || '',
    };
  }

  componentDidMount() {
    this.props.setLoading(true);
    this.props.getAllDepartments(this.props.setLoading)
      .then(()=>{

      });
  }

  // methods
  isValid() {
    const data = {
      'department': this.state.department,
      'positionName': this.state.positionName
    };
    const {errors, isValid} = validatePositionForm(data);

    if (!isValid) {
      this.setState({errors});
    }

    return isValid;
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleSelectChange = (value) => {
    this.setState({department: value});
  };
  onChangeWork = (event)=>{
    const workIndex = event.target.getAttribute('data-index');
    const newWorks = this.state.works.slice();
    newWorks[workIndex].name = event.target.value;
    this.setState({works: newWorks});
  };
  onDeleteWork = (index, event)=>{
    event.preventDefault();
    const works = this.state.works.slice();
    works.splice(index, 1);
    this.setState({works});
  };
  onAddWork = (work, event)=> {
    event.preventDefault();
    const newWorks = this.state.works.slice();
    newWorks.push(work);
    this.setState({works: newWorks});
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.isValid()) {
      this.props.setLoading(true);
      this.setState({errors: {}, resError: ''});
      const data = {
        name: this.state.positionName,
        department: this.state.department,
        works: this.state.works,
      };

      if (this.props.id) data.id = this.props.id;

      editPosition(data)
        .then(() => {
          this.props.setLoading(false);
          this.props.history.push('/positions');

          if(data.id !== undefined){
            this.props.setSuccess('Позицію було успішно відредаговано');
          }else{
            this.props.setSuccess('Позицію було успішно додано');
          }
        })
        .catch((err) => {
          this.props.setError(err)
          this.props.setLoading(false);
          // this.setState({resError: err.response && err.response.data.error || 'error'});
        })
        
    }
  };

  // ..methods
  render() {
//
    return (
      <PositionForm
        title={this.props.title || "Додати позицію"}
        HandleOnChange={this.onChange}
        handleSelectChange={this.handleSelectChange}
        HandleOnSubmit={this.onSubmit}
        departments={this.props.departments}
        setLoading={this.props.setLoading}
        onChangeWork={this.onChangeWork}
        onDeleteWork={this.onDeleteWork}
        onAddWork={this.onAddWork}
        {...this.state}
        works={this.state.works}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    departments: state.position.departments
  }
};
const mapDispatchToProps = dispatch => {
  return {
    getAllDepartments: loader => dispatch(getAllDepartments(loader)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPosition));
