import React, {Component} from 'react';
import {connect} from 'react-redux';

import Title from '../Title';
import MonthPicker from '../elements/monthPicker';
import ProjectTable from './ProjectTable';
import {
  getProjectList as getProjectListAction,
} from '../../actions/lists.action';
import fixTable from '../../admin-lte/fixed-table-master/fixed-table'

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: `Індивідуальний лист` ,
      selectedDate:{
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      loading: false,
      error: false,
      success: null,
    };
  }
  componentDidUpdate(){
    fixTable(document.getElementById('fixed-table-container'));
  }
  setError = (error) =>{
    this.setState({error});
    setTimeout(()=>{
      this.setState({error: false});
    }, 3000)
  };

  setSuccess = (success) =>{
    this.setState({success});
    setTimeout(()=>{
      this.setState({success: null});
    }, 2000)
  };

  monthPickerChange = ({month, year}) =>{
    this.props.getProjectList({month: month - 1, year}, this.props.match.params.id, this.props.setLoading);
    this.setState({selectedDate:{month: month - 1, year}});
  }
  componentDidMount() {
    //Loader (start)
    this.props.setLoading(true);

    this.props.getProjectList(this.state.selectedDate, this.props.match.params.id, this.props.setLoading)
  }
  getTableHeaders = () =>{
    const date = new Date(
      this.state.selectedDate.year,
      this.state.selectedDate.month,
      1, 0, 0, 0, 0);
    const rows = [];
    while (date.getMonth() === this.state.selectedDate.month) {
      rows.push((
        <th key={date.valueOf()}>
          {date.getDate() } <br/>
          {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()]}
        </th>));
      date.setDate(date.getDate() + 1);
    }
    return rows;
  }

  render() {

    return (
      <section className="userList_wrap">
        <Title title={this.state.title}
               usrn={this.props.selectedUser && this.props.selectedUser.name}/>
              {this.props.selectedUser && this.props.selectedUser.isDeleted && <span style={{color: 'red'}}>Цей співробітник знаходиться в архіві тому ви не можете редагувати його час</span>}
        <MonthPicker setDate={this.monthPickerChange}/>
        {this.state.error && Error(this.state.error)}
        {this.state.loading && <i className="fa fa-spinner fa-spin fa-2x fa-fw loading" aria-hidden="true"/>}
        <div id="fixed-table-container" className="table_overflow">
          <table className="table table-bordered table-hover">
            <thead>
            <tr>
              <th>Продукт / <br/>вид робіт <div style={{width: '250px'}}/></th>
              {
                this.getTableHeaders()
              }
              <th>Назагал</th>
              <th>%</th>
            </tr>
            </thead>
            {<ProjectTable
              selectedDate={this.state.selectedDate}
              changeLoading={this.props.setLoading}
              setError={this.setError}
              userId={this.props.match.params.id}
              selectedUser = {this.props.selectedUser}
              setSuccess={this.props.setSuccess}
              setError={this.props.setError}
            />}
          </table>
        </div>
      </section>
    );
  }
}

function Error(error) {
  return (
  <div className={'alert alert-danger alert-dismissible'}>
    <p>{error}</p>
  </div>
  )
}

function Success(message) {
  return (
    <div className={'alert alert-success alert-dismissible'}>
      <p>{message}</p>
    </div>
  )
}



const mapStateToProps = state => {
  return {
      user: state.auth.user,
      selectedUser: state.list.user,
      projects: state.list.projects,
  }
};
const mapDispatchToProps = dispatch => {
  return {
      getProjectList: (date, user, loader) => dispatch(getProjectListAction(date, user, loader))
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(UserList);
