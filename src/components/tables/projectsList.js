import React, { Component } from 'react';
import { connect } from 'react-redux';
import fixTable from '../../admin-lte/fixed-table-master/fixed-table';

import Title from '../Title';
import { getProjectsList as getProjectsListAction, getProjectList, setTimes } from '../../actions/projectsList.action';

const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']

class ProjectsList extends Component {
  constructor (props) {
    super(props)
    this.totalTime = {
      year: {},
      month: {},
    }
    this.state = {
      title: 'Параметри виборки:',
      error: null,
      loading: false,
      selectedProject: null,
      selectedType: 'year',
      selectedNumber: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    }
  }

  componentDidMount () {

    //Loader (start)
    this.props.setLoading(true);

    this.props.getProjects(this.props.setLoading);
  }
  componentDidUpdate(){
      fixTable(document.getElementById('fixed-table-container'));
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.projects.length && nextProps.projects.length) {
      const defaultProject = nextProps.projects[0].id
      this.setState({selectedProject: defaultProject})
      getProjectList(defaultProject, this.state.selectedType, this.state.selectedNumber[this.state.selectedType])
        .then((times) => this.props.setTimes(times))
    }
    else {
      this.setState({error: 'Немає продуктів'})
    }
  }

  selectProjectOnChange = (event) => {
    event.persist();
    this.setState({loading: true});
    getProjectList(event.target.value, this.state.selectedType, this.state.selectedNumber[this.state.selectedType])
      .then((times) => {
        this.setState({selectedProject: event.target.value});
        this.props.setTimes(times);
      });
  }

  selectTypeOnChange = (event) => {
    const type = event.target.value;
    this.setState({loading: true});
    getProjectList(this.state.selectedProject, type, this.state.selectedNumber[type])
      .then((times) => {
        this.setState({selectedType: type});
        this.props.setTimes(times);
      });
  }

  inputNumberOnChange = (event) => {
    if(this.state.selectedType === 'month' && (parseInt(event.target.value,10) > 12 ||
        parseInt(event.target.value,10) < 1) ) return null;
    const now = new Date();
    if(this.state.selectedType === 'year' && (parseInt(event.target.value , 10) > now.getFullYear() ||
        parseInt(event.target.value , 10) < now.getFullYear() - 10 )) return null;
    const obj = Object.assign({}, this.state.selectedNumber);
    obj[this.state.selectedType] = event.target.value;

    getProjectList(this.state.selectedProject, this.state.selectedType, event.target.value)
      .then((times) => {
        this.setState({selectedNumber: obj});
        this.props.setTimes(times);
      });
  };

  getUserMonthTime = (userID, hours_per_month) => {
    const rows = [];
    let userTotalTime = 0;
    const selectedMonth = new Date(new Date().getFullYear(), this.state.selectedNumber.month - 1, 1, 0)
    const times = this.props.times.filter(i => i.project === this.state.selectedProject && i.user === userID);
    while (selectedMonth.getMonth() === this.state.selectedNumber.month - 1) {
      let value = 0;
      let mvalue = 0;
      times.forEach((time) => {
        const timeDate = new Date(Date.parse(time.work_date));
        if (
          selectedMonth.getDate() === timeDate.getDate()
        ) {
          value += time.user_data || 0;
          mvalue +=  time.manager_data || time.user_data || 0;
        }
      })
      this.totalTime.month[selectedMonth.getDate()] = mvalue;
      userTotalTime += mvalue;
      rows.push(<td key={selectedMonth.getDate()}>{value} <span className="cerrectedTime">({mvalue})</span></td>)
      selectedMonth.setDate(selectedMonth.getDate() + 1)
    }

    rows.push(<td key={userID + 'userTotalTime'}>{userTotalTime}</td>);
    const percent = ((hours_per_month || 160)/100) * userTotalTime;
    rows.push(<td key={userID + 'percent'}>{percent.toFixed(0)}%</td>);
    return rows
  }

  getUserYearTime = (userID, hours_per_month) => {
    let userTotalTime = 0;
    const rows = months.map((month, indexMonth) => {
      const times = this.props.times.filter(i =>{
        return  i.user === userID
      });
      let value = 0;
      let mvalue = 0;
      times.forEach((time) => {
        const timeDate = new Date(Date.parse(time.work_date))
        if (timeDate.getMonth() === indexMonth) {
          value += parseFloat(time.user_data || 0);
          mvalue += parseFloat(time.manager_data || time.user_data || 0);
        }
      })
      this.totalTime.year[indexMonth] = mvalue;
      userTotalTime += mvalue;
      return <td key={indexMonth}>{value} <span className="cerrectedTime">({mvalue})</span></td>
    })
    rows.push(<td key={userID + 'TotalTime'}>{userTotalTime}</td>);
    const percent = ((hours_per_month || 160)/100) * userTotalTime;
    rows.push(<td key={userID + 'percent'}>{percent.toFixed(0)}%</td>);
    return rows;
  }

  getPositionMonthTime = (positionID, positionsWithUsers) => {
    const rows = []

    const selectedMonth = new Date(new Date().getFullYear(), this.state.selectedNumber.month - 1, 1, 0)
    const times = this.props.times.filter(i => i.project === this.state.selectedProject && positionsWithUsers[positionID].includes(i.user));
    while (selectedMonth.getMonth() === this.state.selectedNumber.month - 1) {
      let value = 0;
      let mvalue = 0;
      times.forEach((time) => {
        const timeDate = new Date(Date.parse(time.work_date));
        if (
          selectedMonth.getDate() === timeDate.getDate()
        ) {
          value += time.user_data || 0;
          mvalue +=  time.manager_data || time.user_data || 0;
        }
      })
      rows.push(<td key={selectedMonth.getDate()}>{value} <span className="cerrectedTime">({mvalue})</span></td>)
      selectedMonth.setDate(selectedMonth.getDate() + 1)
    }
    return rows
  }

  getPositionYearTime = (positionID, positionsWithUsers) => {
    return months.map((month, indexMonth) => {
      const times = this.props.times.filter(i => i.project === this.state.selectedProject && positionsWithUsers[positionID].includes(i.user));

      let value = 0;
      let mvalue = 0;
      times.forEach((time) => {
        const timeDate = new Date(Date.parse(time.work_date))
        if ( timeDate.getMonth() === indexMonth) {
          value += parseFloat(time.user_data || 0);
          mvalue += parseFloat(time.manager_data || time.user_data || 0);
        }
      })

      return <td key={indexMonth}>{value} <span className="cerrectedTime">({mvalue})</span></td>
    })
  }

  showPositions = () => {
    const positionsWithUsers = {};
    const positions = [];
    this.props.users.forEach((user)=>{
      const positionID = user.position.id;
        if(!positions.hasOwnProperty(positionID)){
          positionsWithUsers[positionID] = [];
        }
        if(!positions.find(({id})=> id === positionID)){
          positions.push(user.position);
        }
        positionsWithUsers[positionID].push(user.id);
    });
    return positions.sort((a,b) => a.name < b.name? -1: 1 ).map((position)=>{
      return (<tr key={position.id}>
        <td>{position.name}</td><td />
        {this.state.selectedType === 'year'? this.getPositionYearTime(position.id, positionsWithUsers): this.getPositionMonthTime(position.id, positionsWithUsers)}
        <td /><td />
      </tr>)
    })
  }

  showTotalYearTime = ()=> {
    return months.map((month, indexMonth) => (<td key={indexMonth}>{this.totalTime.year[indexMonth]}</td>))
  }
  showTotalMonthTime = ()=>{
    const rows = [];
    const selectedMonth = new Date(new Date().getFullYear(), this.state.selectedNumber.month - 1, 1, 0);
    while (selectedMonth.getMonth() === this.state.selectedNumber.month - 1) {
      rows.push(<td key={selectedMonth.getDate()}>{this.totalTime.month[selectedMonth.getDate()]}</td>)
      selectedMonth.setDate(selectedMonth.getDate() + 1);
    }
    return rows;
  }

  render () {
    return (
      <section className="userList_wrap">
        <Title title={this.state.title}/>
        <select name="projects" id="selectProjects" onChange={this.selectProjectOnChange}>
          {
            this.props.projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>))
          }
        </select>
        Період:
        <select onChange={this.selectTypeOnChange}>
          <option value="year">за рік</option>
          <option value="month">за місяць</option>
        </select>

        <input onChange={this.inputNumberOnChange} type="number"
               value={this.state.selectedNumber[this.state.selectedType]}/>
        <div id="fixed-table-container" className="table_overflow fixed-table-container">
          <table className="table table-bordered table-hover table-project">
            <thead>
            <tr>
              <th>Співробітник <div style={{width: '250px'}}/></th>
              <th>Позиція</th>
              {this.state.selectedType === 'year' && months.map((month) => (<th key={month}>{month}</th>))}
              {this.state.selectedType === 'month' && getMonthHeader(this.state.selectedNumber.month)}
              <th>Назагал</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {
              this.props.users.map((user) => {
                return (<tr key={user.id}>
                  <td>{`${user.surname} ${user.name}`}</td>
                  <td>{user.position.name}</td>
                    {this.state.selectedType === 'year'? this.getUserYearTime(user.id, user.hours_per_month): this.getUserMonthTime(user.id, user.hours_per_month)}
                </tr>)
              })
            }
            <tr><td>Назагал</td><td />
              {this.state.selectedType === 'year'? this.showTotalYearTime(): this.showTotalMonthTime()}
             <td /><td />
            </tr>
            <tr className="empty-row"><td /><td />

            </tr>
            {this.showPositions()}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
}

function getMonthHeader (selectedMonth) {
  const selectedDate = new Date(new Date().getFullYear(), selectedMonth - 1, 1, 0, 0, 0, 0)
  const rows = []
  while (selectedDate.getMonth() === selectedMonth - 1) {
    rows.push(<th key={selectedDate.getDate()}>{selectedDate.getDate()}</th>)
    selectedDate.setDate(selectedDate.getDate() + 1)
  }
  return rows
}

const mapStateToProps = state => {
  return {
      projects: state.projectsList.projects,
      users: state.projectsList.users,
      times: state.projectsList.times,
  }
};
const mapDispatchToProps = dispatch => {
  return {
      getProjects : loader => dispatch(getProjectsListAction(loader)),
      setTimes    : (times,loader) => dispatch(setTimes(times,loader)),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(ProjectsList)
