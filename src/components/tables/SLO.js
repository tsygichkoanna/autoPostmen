import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Select from 'react-select';
import Title from '../Title'
import MonthPicker from '../elements/monthPicker'
import TimeCell from '../elements/TimeCell'
import { getSLO as SLOaction } from '../../actions/SLO.action'
import { getAllDepartments } from '../../actions/positions.action'
import fixTable from '../../admin-lte/fixed-table-master/fixed-table'

class SLO extends Component {
  constructor (props) {
    super(props);

    this.state = {
      title: 'Зведена таблиця відділу Керування продуктами',
      error: null,
      loading: false,
      selectedDate: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      projectsTime: {},
      selectedDepartment: null,
      
    };

    this.totalProjectTime = {
      totalValue: 0,
      totalMvalue: 0,
      totalTime: 0
    }
    
    this.totalUserTime = {}
    this.monthPickerChange = this.monthPickerChange.bind(this)

  }
  componentDidUpdate(){
    if(this.props.clients.length){
      fixTable(document.getElementById('fixed-table-container1'));
      fixTable(document.getElementById('fixed-table-container2'));
    }
  }

  componentDidMount () {
    const {auth_user} = this.props;
    
    //Loader (start)
    this.props.setLoading(true);
    this.props.getSLO(this.state.selectedDate,this.props.setLoading, this.state.selectedDepartment)

    if(this.checkRole(auth_user, 'admin') || this.checkRole(auth_user, 'jadmin')){
      this.props.getAllDepartments(this.props.setLoading)
      .then(()=>{});
    }
  }

  monthPickerChange ({month, year}) {
    this.props.setLoading(true);
    this.props.getSLO({month: month - 1, year}, this.props.setLoading, this.state.selectedDepartment);
    this.setState({selectedDate: {month: month - 1, year}})
  }

  showUsersTable = () => {
    return this.props.users.map((user) => user.role !== 'admin'?
      (<th key={user.id}>
        <Link to={'/individual-list/' + user.id}>{user.surname}<br/>{user.name}</Link>
      </th>): null)
  };

  showTable = (isTotalTable) => {
    const rows = [];

    this.totalProjectTime  = {
      totalValue: 0,
      totalMvalue: 0,
      totalTime: 0
    }
    this.totalUserTime = {}

    this.props.clients.sort((a,b) => a.name < b.name? -1: 1 ).forEach((client)=> {
      if(client.projects.length && client.name !== client.projects[0].name){
        rows.push(<tr key={client._id}>
          <td className="client">{client.name}</td>
          {Array(this.props.users.filter(i=> i.role !== 'admin').length ).fill('-').map( (i, index) => <td key={index}>{i}</td>) }
          <td> - </td>
        </tr>);
      }
      client.projects.sort((a,b) => a.name < b.name? -1: 1 ).forEach((project)=>{
        rows.push(<tr key={project.id}>
          <td>{project.name}</td>


          {this.showUserTime(project, isTotalTable)}
          
          {this.totalProjectTime['work'] && <TimeCell value={this.totalProjectTime['work'][project.id].value}
                    mvalue={this.totalProjectTime['work'][project.id].mvalue}/>}


        </tr>)
      });
    });

    this.props.general.forEach((generalWork)=>{
      rows.push(<tr key={generalWork.slug}>
        <td className="client">{generalWork.name}</td>
        {this.showCommonTime(generalWork, 'general', isTotalTable)}


        {this.totalProjectTime['general'] && <TimeCell value={this.totalProjectTime['general'][generalWork.slug].value}
                  mvalue={this.totalProjectTime['general'][generalWork.slug].mvalue}/>}

      </tr>)

    });

    this.props.holidays.forEach((holiday)=>{
      rows.push(<tr key={holiday.slug}>
        <td className="client">{holiday.name}</td>
        {this.showCommonTime(holiday, 'holiday', isTotalTable)}

         {this.totalProjectTime['holiday'] && <TimeCell value={this.totalProjectTime['holiday'][holiday.slug].value}
                  mvalue={this.totalProjectTime['holiday'][holiday.slug].mvalue}/>}

      </tr>)

    });

    rows.push(<tr key="total">
      <td>Назагал</td>
      {this.showUserTotalTime()}

      <TimeCell value={this.totalProjectTime.totalValue}
                mvalue={this.totalProjectTime.totalMvalue}/>

    </tr>)

    return rows;
  };

  showUserTotalTime = () => {
    return this.props.users.map((user)=>{
      if(user.role === 'admin') return null;

      const value = this.totalUserTime[user.id].value;

      const mvalue = this.totalUserTime[user.id].mvalue;

      return <TimeCell key={user.id} value={value} mvalue={mvalue}/>

    });
  };

  showCommonTime = (holiday, type_of_time,  isTotalTable)=>{
    return this.props.users.map((user)=>{
      if(user.role === 'admin') return null;
      let value = 0;
      let mvalue = 0;
      this.props.times.forEach((time)=>{
        if(time.type_of_time !== type_of_time
          || time.type_of_holiday !== holiday.slug
          || time.user !== user.id)
          return null;
          
        value += time.user_data || 0;
        mvalue += time.manager_data || time.user_data || 0;
      });

      // calculate user total time
      this.saveUserTotalTime(user.id, value, mvalue);

      // calculate project total time
      this.saveProjectTotalTime({
        type: type_of_time, 
        identifier: holiday.slug,
        value,
        mvalue
      });

      if(isTotalTable){
        return (<td key={user.id}>{mvalue}</td>)
      }

      return <TimeCell key={user.id}
        value={value}
        mvalue={mvalue}/>

    });
  };

  calculateUserTime = () => {

  }

  showUserTime = (project, isTotalTable)=>{
    // console.log(project);
    return this.props.users.map((user)=>{
      if(user.role === 'admin') return null;


      let mvalue = 0;
      let value = 0;
      let projectTime = 0;

      this.props.times.forEach((time)=>{
        if(time.type_of_time !== 'work'
          || time.project !== project.id
          || time.user !== user.id)
          return null;

        value += time.user_data || 0;
        mvalue += time.manager_data || time.user_data || 0;
      })


      // calculate user total time
      this.saveUserTotalTime(user.id, value, mvalue);


      // calculate project total time
      this.saveProjectTotalTime({
        type:'work',
        identifier: project.id,
        value,
        mvalue
      });

      if(isTotalTable){
        return (<td key={user.id}>{mvalue}</td>)
      }

      return <TimeCell key={user.id}
        value={value}
        mvalue={mvalue}/>
    });
  };

  saveUserTotalTime = (user_id, value, mvalue) => {
    // check object existing
    if(!this.totalUserTime[user_id]){
      // create new user object
      this.totalUserTime[user_id] = {
        value: 0,
        mvalue: 0,
        totalValue: 0
      }
    }

    // save
    this.totalUserTime[user_id].value += value;
    this.totalUserTime[user_id].mvalue += mvalue;

    let userTime = value;
    if(mvalue !== 0){
      userTime = mvalue;
    }
    this.totalUserTime[user_id].totalValue += userTime;
  }

  saveProjectTotalTime = (project_info) => {
    const {type, identifier, value, mvalue, projectTime} = project_info;


    // check 'type' object existing
    if(!this.totalProjectTime[type]){
      this.totalProjectTime[type] = {}
    }
    // check 'identifier' object existing
    if(!this.totalProjectTime[type][identifier]){
      this.totalProjectTime[type][identifier] = {
        value: 0,
        mvalue: 0,
        totalValue: 0
      };
    }

    // calculate total for this [type][identifier]
    this.totalProjectTime[type][identifier].value += value;
    this.totalProjectTime[type][identifier].mvalue += mvalue || value;

    this.totalProjectTime[type][identifier].totalValue += projectTime;

    // calculate total
    this.totalProjectTime.totalValue += value;
    this.totalProjectTime.totalMvalue += mvalue || value;
    this.totalProjectTime.totalTime += projectTime;
  }

  checkRole = (user, role) => {
    if (!user.role) return false

    return user.role.slug === role
      || user.role === role
  }

  departmentSelectHandler = (value) => {
    this.setState({selectedDepartment: value});

    this.props.getSLO(this.state.selectedDate, this.props.setLoading, value)
  }

  render () {
    const {auth_user, departments, users } = this.props;

    let showTable = false;

    if(users.length !== 0){
      showTable = true;
      if(users.length === 1 && users[0].role === 'admin'){
        showTable = false;
      }
    }

    return (
      <section className="userList_wrap">
        <Title title={this.state.title}/>

        <div className="param_resul_list">
          <MonthPicker setDate={this.monthPickerChange}/>
          
          {(this.checkRole(auth_user, 'admin') || this.checkRole(auth_user, 'jadmin')) &&
            (<div className='form-group'>
                <Select
                name="department"
                onChange={this.departmentSelectHandler}
                options={departments}
                placeholder="Відділ"
                simpleValue
                value={this.state.selectedDepartment}
                />
              </div>)}
        </div>

        <h3>Загальна кількість годин  (Корективи керівника)</h3>
        {showTable ? (
          <div id="fixed-table-container1" className="table_overflow slo-wrapper">
            <table className="table table-bordered table-hover slo-table">
              <thead>
              <tr>
                <th>Клиенты \<br/> сотрудники <div style={{width: '250px'}}/></th>
                {this.showUsersTable()}
                <th>Назагал</th>
              </tr>
              </thead>
              <tbody>
                {this.showTable()}
              </tbody>
            </table>
          </div>
        ) : (
          <div> 
            Виберіть відділ
          </div>
        )}
      </section>
    )
  }
}


const mapStateToProps = state => {
  return {
      clients: state.slo.clients,
      users: state.slo.users,
      times: state.slo.times,
      holidays: state.slo.holidays,
      general: state.slo.general,
      auth_user: state.auth.user,
      departments: state.position.departments,
  }
};
const mapDispatchToProps = dispatch => {
  return {
      getSLO : (date,loader,department) => dispatch(SLOaction(date,loader,department)),
      getAllDepartments: loader => dispatch(getAllDepartments(loader)),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(SLO)
