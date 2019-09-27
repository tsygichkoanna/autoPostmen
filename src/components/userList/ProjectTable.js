import React, {Component} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
import {
  saveTime,
  getTotalTimeAndPercents,
} from '../../actions/lists.action';

import TimeCell from '../elements/TimeCell'
import TimeCellWithInput from '../elements/TimeCellWithInput'

class ProjectTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipTitle: 'Час можна додавати тільки до окремих видів робіт',
      times: [],
      truancy: [],
      startDate: new Date(),
      tooltipTitleFontColor: '#333'
    };
    this.totalTimePerDay = {};
    this.totalTime = 0;
    this.totalFreeTime = 0;
    this.hours_per_month = countWorkDays(props.selectedDate.year, props.selectedDate.month, props.start_date);
  }

  handleChange = (event) => {
    const projectId = event.target.getAttribute("data-project");
    const workId = event.target.getAttribute("data-work");
    const date = event.target.getAttribute("data-date");
    const typeOfTime = event.target.getAttribute("data-type-of-time");
    const typeOfHoliday = event.target.getAttribute("data-type-of-holiday");

    const newArray = this.state.times.slice();
    const index =  newArray.findIndex(({type_of_time, type_of_holiday, work_date, work, project})=>
        project === projectId &&
        work === workId &&
        +date === work_date.getDate() &&
        typeOfTime === type_of_time &&
        type_of_holiday == typeOfHoliday
    );

    const newTime = {
      project : projectId ,
      work: workId ,
      work_date: new Date(this.props.selectedDate.year, this.props.selectedDate.month, +date),
      type_of_time  : typeOfTime,
      type_of_holiday : typeOfHoliday,
    };
    const isManager = this.props.userRole.slug === 'head_of_department';

    if(isManager){
      newTime.manager_data = parseFloat(event.target.value) || 0;
    } else {
      newTime.user_data = parseFloat(event.target.value) || 0;
    }

    if(index >= 0){
      if(isManager){
        newTime.user_data = newArray[index].user_data;
      } else {
        newTime.manager_data = newArray[index].manager_data;
      }
      newTime.id = newArray[index].id;
      newTime.client = newArray[index].client;
      newArray[index] = newTime;
      
    } else {
      newArray.push(newTime);
    }

    this.setState({times: newArray});
  }

  handleKeyDown = (event)=>{
    if(event.keyCode !== 13) {
      return false; // returning false will prevent the event from bubbling up.
    }
    this.handleBlur(event);
  };

  handleBlur = (event) => {
    const time = parseFloat(event.target.value) || 0;

    const projectId = event.target.getAttribute("data-project");
    const workId = event.target.getAttribute("data-work");
    const date = new Date(this.props.selectedDate.year, this.props.selectedDate.month, + event.target.getAttribute("data-date")) ;
    const timeId = event.target.getAttribute("data-time-id");
    const typeOfTime = event.target.getAttribute("data-type-of-time");
    const typeOfHoliday = event.target.getAttribute("data-type-of-holiday");
    const client = event.target.getAttribute("data-client");

    const index =  this.state.times.findIndex(({type_of_time, type_of_holiday, work_date, work, project})=>
      project === projectId &&
      work === workId &&
      date.getDate() === work_date.getDate() &&
      typeOfTime === type_of_time &&
      type_of_holiday == typeOfHoliday
    );
    if(index === -1 && !event.target.value) return;

    if(this.totalTimePerDay[event.target.getAttribute("data-date")] >= 20 ){
      this.props.setError('Не можна записувати більше 20 годин на добу');
      return false;
    }

    this.props.changeLoading(true);
    saveTime({
      work: workId,
      project: projectId,
      time,
      date,
      timeId,
      type_of_time: typeOfTime,
      type_of_holiday: typeOfHoliday,
      user: this.props.userId,
      client,
      direction: this.props.selectedUser.direction,
      department: this.props.selectedUser.department,
      position: this.props.selectedUser.position
    })
      .then(()=>{
        this.props.changeLoading(false);
        // this.props.setSuccess(`Время сохранилось. ${date.toDateString()} time: ${time}`);
        this.props.setSuccess(`Время сохранилось.`);
      })
      .catch(()=>{
        this.props.changeLoading(false);
        this.props.setError('Помилка збереження часу');
      });
  };

  componentWillUpdate(nextProps) {
    this.totalTimePerDay = {};
    this.totalTime = 0;
    this.totalFreeTime = 0;
    this.hours_per_month = countWorkDays(nextProps.selectedDate.year, nextProps.selectedDate.month, nextProps.start_date);
  }

  componentWillReceiveProps(nextProps) {
    let times = nextProps.times.map(i => ({ ...i, work_date: new Date(i.work_date)}));
    this.setState({ times });
    this.props.changeLoading(false);
  }

  showProjects() {
    return this.props.clients.map((client) => {
        return this.getParentProject(client, this.props.selectedDate)
    })
  }

  getParentProject(client, selectedDate) {
    const preparedProjects = [];
    const { totalTimeForRow, percent } = getTotalTimeAndPercents(this.hours_per_month, this.props.times, 'client', client.id);
    const isDeletedClient = !this.props.user.clients.find(i=> i === client.id);
    preparedProjects.push(
      <tr key={client.id}
          className={cx("projectName_row",)}
          data-toggle="tooltip"
          data-placement="top"
          title='Час можна додавати тільки до окремих видів робіт'
      >
        <td className={cx('project_title', 'fixed', 'client_cell', { deleted_cell: isDeletedClient})}>
            {client.name}
        </td>
        {this.getProjectTable(client, selectedDate, 'client')}
        <td>{this.toFixed(totalTimeForRow)}</td>
        <td>{percent}%</td>
      </tr>
    );

    this.props.projects.filter( i => i.client === client.id).forEach((project) => {
      const { totalTimeForRow, percent } = getTotalTimeAndPercents(this.hours_per_month, this.state.times, 'project', project.id);
      const isDeletedProject = !this.props.user.projects.find(i => i === project.id) || isDeletedClient;

      if(project.name !== client.name){
        preparedProjects.push(
          <tr key={project.id}
              className={cx("projectName_row")}
              data-toggle="tooltip"
              data-placement="top"
              title='Час можна додавати тільки до окремих видів робіт'>

            <td className={cx('project_title', 'fixed', 'project_cell', { deleted_cell: isDeletedProject})}>
              {project.name}
            </td>
            {this.getProjectTable(project, selectedDate, 'project')}
            <td>{this.toFixed(totalTimeForRow)}</td>
            <td>{percent}%</td>
          </tr>
        );
      }
      this.props.works.forEach((work)=>{
        const isDeletedWork = !this.props.user.works.find(i=> i.id === work.id && i.project === project.id);
        if(isDeletedWork){
          const hasTimes = !!this.props.times.find(i=> i.work === work.id && i.project === project.id);
          if(!hasTimes) return;
        }
        const { totalTimeForRow, percent } = getTotalTimeAndPercents(this.hours_per_month, this.state.times, 'work', work.id, 'project', project.id);
        const workObj = this.props.works.find(i=> i.id === work.id);
        preparedProjects.push(
          <tr key={`${work.id} ${project.id}`}
              className={cx("projectTask_row")}
          >
            <td className={'fixed'}>
              {isDeletedWork ? 
                <strong>{workObj.name}</strong>
              :
                workObj.name
              }
            </td>
            {this.getProjectTable(workObj, selectedDate, isDeletedWork? 'work': false, {'project': project._id, 'client': client.id})}
            <td>{this.toFixed(totalTimeForRow)}</td>
            <td>{percent}%</td>
          </tr>
        );
      });
    });
    return preparedProjects;
  };

  getProjectTable({id}, selectedDateParams, isName = false, params) {
    
    const currentDate = new Date();
    const date = new Date(selectedDateParams.year, selectedDateParams.month, 1, 0, 0, 0);
    const rows = [];
    while (date.getMonth() === selectedDateParams.month) {
      let haveManagerChanges = false;
      let value = '';
      let timeId = null;
      let mvalue = '';
      if(this.props.start_date > date){
        rows.push(<td key={date.getDate()} className='read-only'> - </td>);
        date.setDate(date.getDate() + 1);
        continue;
      }
      if(isName === 'work'){
        const clientTimes = this.state.times
          .filter(i => {
            const work_date = new Date(i.work_date);
            return i[isName] === id && work_date.getDate() === date.getDate() && i.project === params.project
      })
          .reduce((reducer, time)=>{
              if(!this.totalTimePerDay[date.getDate()]){
                this.totalTimePerDay[date.getDate()] = 0;
              }
              
              this.totalTimePerDay[date.getDate()] += parseFloat(time.manager_data) || parseFloat(time.user_data) || 0;
              this.totalTime += parseFloat(time.manager_data) || parseFloat(time.user_data) || 0;
              return ({
                value: reducer.value + (time.user_data || 0),
                mvalue: reducer.mvalue + (time.manager_data || time.user_data || 0),
              })
            },
            {value: 0, mvalue: 0});
        rows.push(<TimeCell key={date.getDate()} value={clientTimes.value} mvalue={clientTimes.mvalue} readOnly={true}/>);
        date.setDate(date.getDate() + 1);
        continue;
      }

      if(isName){
        const clientTimes = this.state.times
          .filter(i => {
            const work_date = new Date(i.work_date);
            return i[isName] === id &&  work_date.getDate() === date.getDate()
          })
          .reduce((reducer, time)=>{
            return ({
              value: reducer.value + (time.user_data || 0),
              mvalue: reducer.mvalue + (time.manager_data || time.user_data || 0),
            })
            },
            {value: 0, mvalue: 0});
        rows.push(<TimeCell key={date.getDate()} value={clientTimes.value} mvalue={clientTimes.mvalue} readOnly={true}/>);
        date.setDate(date.getDate() + 1);
        continue;
      }

      const index = this.state.times.findIndex(({type_of_time, work_date, work, project})=>
        {
          return project === params.project &&
            work === id  &&
            type_of_time === 'work' &&
            work_date.getDate() === date.getDate()
        }
      );
      if(index >= 0){
        value = this.state.times[index].user_data;
        mvalue = this.state.times[index].manager_data;
        timeId = this.state.times[index].id;
        if(!this.totalTimePerDay[date.getDate()]){
          this.totalTimePerDay[date.getDate()] = 0;
        }

        // calculate total day time
        // and total month time
        this.calculateTotalTime(date.getDate(), mvalue, value);

      }
      const isManager = this.props.userRole.slug === 'head_of_department';
      if(isManager && !mvalue && mvalue !== 0){
        mvalue = value;
      }
      if(mvalue && !value && value !== 0){
        value = mvalue;
      }
      let readOnly = (currentDate.getMonth() !== date.getMonth())
       || (currentDate.getDate() < date.getDate())
       || (currentDate.getDate() > date.getDate() + 6 );

      if((this.props.userRole.slug === 'employee') || (this.props.userRole.slug === 'account_manager')){
        if((mvalue !== '') && (mvalue !== undefined)){
          readOnly = true;
          haveManagerChanges = true;
        }
      }

      if(this.checkAdminsRoles(this.props.userRole.slug)){
        readOnly = false;
      }

      if(this.props.user.isDeleted){
        readOnly = true
      }
     

      let inputValue = value;

      if(value !== '' && value !== undefined){
        value = this.toFixed(value) //parseFloat(value).toFixed(2)
      }

      if(mvalue !== '' && mvalue !== undefined){
        mvalue = this.toFixed(mvalue) //parseFloat(mvalue).toFixed(2)

        if(mvalue >= 0){
          inputValue = mvalue;
        }
      }

    rows.push(

      haveManagerChanges && !this.checkAdminsRoles(this.props.userRole.slug) ? 
      <TimeCell key={date.getDate()} value={value} mvalue={mvalue} readOnly={readOnly}/>
      :
      
      <TimeCellWithInput key={date.getDate()} mvalue={mvalue} value={value} inputOption={{
        readOnly,
        typeOfTime: "work",
        date: date.getDate(),
        timeId,
        inputValue,
        onChange: !readOnly && this.handleChange,
        onKeyDown: !readOnly && this.handleKeyDown,
        onBlur: !readOnly && this.handleBlur,
        
        dataWork: id,
        dataBlur: readOnly,
        dataProject: params.project,
        dataClient: params.client


      }} />);


      date.setDate(date.getDate() + 1);
    }
    return rows;
  };

  showTruancyTable(truancyArray) {
    if (!truancyArray || !truancyArray.length) return;
    return truancyArray.map((holiday) => {
      const { totalTimeForRow, percent } = getTotalTimeAndPercents(this.hours_per_month,this.state.times, 'type_of_holiday', holiday.slug, this.props);
      return (
        <tr key={holiday.slug} className="projectTask_row truancy">
          <td className="project_title fixed holiday_cell">{holiday.name}</td>
          {
            this.getTruancyTable(holiday.slug)
          }
          <td>{this.toFixed(totalTimeForRow)}</td>
          <td>{percent}%</td>
        </tr>
      )
    })
  };

  getTruancyTable(slug) {
    const currentDate = new Date();
    const date = new Date(this.props.selectedDate.year, this.props.selectedDate.month, 1, 0, 0, 0);
    const rows = [];
    while (date.getMonth() === this.props.selectedDate.month) {
      if(this.props.start_date > date){
        rows.push(<td key={date.getDate()} className='read-only'> - </td>);
        date.setDate(date.getDate() + 1);
        continue;
      }
      let haveManagerChanges = false;
      let value = '';
      let timeId = null;
      let mvalue = '';
      const index = this.state.times.findIndex(({type_of_time, type_of_holiday, work_date})=>
        type_of_holiday === slug &&
        type_of_time === 'holiday' &&
        work_date.getDate() === date.getDate()
      );
      if(index >= 0){
        value = this.state.times[index].user_data;
        mvalue = this.state.times[index].manager_data;
        timeId = this.state.times[index].id;
        if(!this.totalTimePerDay[date.getDate()]){
          this.totalTimePerDay[date.getDate()] = 0;
        }

        // calculate total day time
        // and total month time
        this.calculateTotalTime(date.getDate(), mvalue, value);

      }
      const isManager = this.props.userRole.slug === 'head_of_department';
      if(isManager && !mvalue && mvalue !== 0){
        mvalue = value;
      }
      if(mvalue && !value && value !== 0){
        value = mvalue;
      }

      let readOnly =
        (currentDate.getMonth() !== date.getMonth())
        || (currentDate.getDate() < date.getDate())
        || (currentDate.getDate() > date.getDate() + 6 );

      if((this.props.userRole.slug === 'employee') || (this.props.userRole.slug === 'account_manager')){
        if((mvalue !== '') && (mvalue !== undefined)){
          readOnly = true;
          haveManagerChanges = true;
        }
      }

      if(this.checkAdminsRoles(this.props.userRole.slug)){
        readOnly = false;
      }

      if(this.props.user.isDeleted){
        readOnly = true
      }

      let inputValue = value;

      if(value !== '' && value !== undefined){
        value = this.toFixed(value) //parseFloat(value).toFixed(2)
      }

      if(mvalue !== '' && mvalue !== undefined){
        mvalue = this.toFixed(mvalue) //parseFloat(mvalue).toFixed(2)

        if(mvalue >= 0){
          inputValue = mvalue;
        }
      }

      rows.push(

        haveManagerChanges && !this.checkAdminsRoles(this.props.userRole.slug) ? 
        <TimeCell key={date.getDate()} value={value} mvalue={mvalue} readOnly={readOnly}/>
        :

        <TimeCellWithInput key={date.getDate()} mvalue={mvalue} value={value} inputOption={{
          readOnly,
          typeOfTime: "holiday",
          typeOfHoliday: slug,
          date: date.getDate(),
          timeId,
          inputValue,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          onBlur: !readOnly && this.handleBlur

        }} />);
      date.setDate(date.getDate() + 1);
    }
    return rows;
  }

  showTotalTime(isFreeTime) {
    this.totalFreeTime = 0;
    const date = new Date(this.props.selectedDate.year, this.props.selectedDate.month, 1, 0, 0, 0);
    const rows = [];
    while (date.getMonth() === this.props.selectedDate.month) {
      if(this.props.start_date > date){
        rows.push(<td key={date.getDate()} className='read-only'> - </td>);
        date.setDate(date.getDate() + 1);
        continue;
      }

      let value = Math.round(this.totalTimePerDay[date.getDate()] * 10 );
      value = value ? value / 10  : 0;
      let freeTime = Math.max(0, 7.5 - value).toFixed(2);
      if(date.getDay() === 0 || date.getDay() === 6 || this.props.start_date > date){
        freeTime = '';
      } else{
        this.totalFreeTime += Math.max(0, 7.5 - value || 0);        
      }

      if(freeTime !== ''){
        freeTime = this.toFixed(+freeTime);
      }

      if(value !== ''){
        value = this.toFixed(value);
      }

      rows.push((
        <td key={date.getDate()}>
          {isFreeTime
            ? freeTime
            : value}
        </td>));
      date.setDate(date.getDate() + 1);
    }
    return rows;
  }

  showGeneralTable(generalArray) {
    if (!generalArray || !generalArray.length) return;
    return generalArray.map((generalWork) => {
      const { totalTimeForRow, percent } = getTotalTimeAndPercents(this.hours_per_month,this.state.times, 'type_of_holiday', generalWork.slug, this.props);
      return (
        <tr key={generalWork.slug} className="projectTask_row truancy">
          <td className="project_title fixed holiday_cell">{generalWork.name}</td>
          {
            this.getGeneralTable(generalWork.slug)
          }
          <td>{this.toFixed(totalTimeForRow)}</td>
          <td>{percent}%</td>
        </tr>
      )
    })
  };

  getGeneralTable(slug) {
    const currentDate = new Date();
    const date = new Date(this.props.selectedDate.year, this.props.selectedDate.month, 1, 0, 0, 0);
    const rows = [];
    while (date.getMonth() === this.props.selectedDate.month) {
      if(this.props.start_date > date){
        rows.push(<td key={date.getDate()} className='read-only'> - </td>);
        date.setDate(date.getDate() + 1);
        continue;
      }
      let haveManagerChanges = false;
      let value = '';
      let timeId = null;
      let mvalue = '';
      const index = this.state.times.findIndex(({type_of_time, type_of_holiday, work_date})=>
        type_of_holiday === slug &&
        type_of_time === 'general' &&
        work_date.getDate() === date.getDate()
      );

      if(index >= 0){
        value = this.state.times[index].user_data;
        mvalue = this.state.times[index].manager_data;
        timeId = this.state.times[index].id;
        if(!this.totalTimePerDay[date.getDate()]){
          this.totalTimePerDay[date.getDate()] = 0;
        }

        // calculate total day time
        // and total month time
        this.calculateTotalTime(date.getDate(), mvalue, value);
      }
      
      const isManager = this.props.userRole.slug === 'head_of_department';
      if(isManager && !mvalue && mvalue !== 0){
        mvalue = value;
      }

      if(mvalue && !value && value !== 0){
        value = mvalue;
      }

      let inputValue = value;

      if(mvalue !== '' && mvalue !== undefined){
        mvalue = this.toFixed(mvalue) //parseFloat(mvalue).toFixed(2)

        if(mvalue >= 0){
          inputValue = mvalue;
        }
      }

      let readOnly =(currentDate.getMonth() !== date.getMonth())
        || (currentDate.getDate() < date.getDate())
        || (currentDate.getDate() > date.getDate() + 6 );

      if((this.props.userRole.slug === 'employee') || (this.props.userRole.slug === 'account_manager')){
        if((mvalue !== '') && (mvalue !== undefined)){
          readOnly = true;
          haveManagerChanges = true;
        }
      }

      if(this.checkAdminsRoles(this.props.userRole.slug)){
        readOnly = false;
      }

      if(this.props.user.isDeleted){
        readOnly = true
      }

      rows.push(

        haveManagerChanges && !this.checkAdminsRoles(this.props.userRole.slug) ? 
        <TimeCell key={date.getDate()} value={value} mvalue={mvalue} readOnly={readOnly}/>
        :
        
        <TimeCellWithInput key={date.getDate()} mvalue={mvalue} value={value} inputOption={{
          readOnly,
          typeOfTime: "general",
          typeOfHoliday: slug,
          date: date.getDate(),
          timeId,
          inputValue: inputValue,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          onBlur: !readOnly && this.handleBlur

        }} />);

      date.setDate(date.getDate() + 1);
    }
    return rows;
  }

  calculateTotalTime = (date, mvalue, value) => {
    mvalue = parseFloat(mvalue);

    if(mvalue !== undefined && mvalue >= 0){
      this.totalTimePerDay[date] += mvalue
      this.totalTime += mvalue
    }else{
      this.totalTimePerDay[date] += parseFloat(value) || 0;
      this.totalTime += parseFloat(value) || 0;
    }
  }

  checkAdminsRoles = (userRole) => {
    if(userRole === 'admin' || userRole === 'jadmin' || userRole === 'head_of_department'){
      return true
    }
    return false
  }

  toFixed = (number) => {
    return +number % 1 * 10 >= 1
    ? +number.toFixed(1)
    : +number.toFixed(0)
  }

  render() {
    return (
      <tbody>
      {
        (this.props.clients.length !== 0) && (this.showProjects())
      }
      {
        this.showGeneralTable(this.props.general)
      }
      {
        this.showTruancyTable(this.props.holidays)
      }
      <tr>
        <td>Вільний час</td>
        {this.showTotalTime(true)}
        <td>{this.toFixed(this.totalFreeTime)}</td>
        <td />
      </tr>
      <tr>
        <td>Назагал</td>
        {this.showTotalTime()}
        <td>{this.totalTime.toFixed(2)}</td>
        <td>{
          this.toFixed((this.totalTime/( this.hours_per_month / 100))) || 0
        }%</td>
      </tr>
      </tbody>
    )
  }
}
function countWorkDays (year, month, startDate) {
  let date = new Date(year, month, 1);
  let workDays = 0;
  while (date.getMonth() ===  month){
    if(date.getDate() !== 0 && date.getDate() !== 6  && startDate <= date){
      workDays++;
    }
    date.setDate(date.getDate()+1);
  }
  return workDays * 7.5;

}

export default connect(
  state => ({
    user: state.list.user,
    userRole: state.auth.user.role,
    projects: state.list.projects,
    clients: state.list.clients,
    works: state.list.works,
    holidays: state.list.holidays,
    general: state.list.general,
    times: state.list.times,
    start_date: new Date(state.list.start_date),
  }),
)(ProjectTable);