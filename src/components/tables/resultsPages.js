import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'

import Title from '../Title'
import { getResults } from '../../actions/resultsList.action'
import MonthPicker from '../elements/monthPicker'
import classnames from 'classnames'
import fixTable from '../../admin-lte/fixed-table-master/fixed-table'

class ProjectsList extends Component {
  constructor (props) {
    super(props)
    this.totalPerUser = {}
    this.usefulTotalPerUser = {}
    this.total = 0
    this.state = {
      title: 'Результуючі листи',
      error: null,
      loading: false,
      firstValue: 'client',
      secondValue: 'user',
      thirdValue: 'time',
      direction: '2',
      excludeFirstValue: [],
      dataToShow: {
        firstValue: [],
        secondValue: [],
        thirdValue: [],
        general: [],
        holiday: []
      },
      selectedNumber: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    }
    this.hourPerMonth = this.getMonthHours(this.state.selectedNumber)
  }

  shouldComponentUpdate(nextProps, nextState){
    let shouldUpdate = false
    Object.keys(nextState).forEach((key)=>{
      if(nextState[key] !== this.state[key] ){
        shouldUpdate =  true
      }
    })

    return shouldUpdate
  }

  getMonthHours = ({month, year}) => {
    const date = new Date(year, month - 1, 1)
    let days = 0
    while (date.getMonth() === month - 1) {
      if (date.getDay() !== 6 && date.getDay() !== 0) {
        days++
      }
      date.setDate(date.getDate() + 1)
    }
    return days * 7.5
  }

  componentDidMount () {
    this.props.setLoading(true)
    const {firstValue, secondValue, thirdValue, direction, excludeFirstValue} = this.state
    const values = {
      firstValue, secondValue, thirdValue, direction, excludeFirstValue
    }
    this.totalPerUser = {}
    getResults(this.state.selectedNumber, values)
      .then((res) => {
        this.setState({dataToShow: res})
        this.props.setLoading(false)
      })
  }

  componentDidUpdate () {
    fixTable(document.getElementById('fixed-table-container'))
  }

  selectTypeOnChange = (name, target) => {

    const {firstValue, secondValue, thirdValue, direction, excludeFirstValue} = this.state
    const values = {
      firstValue, secondValue, thirdValue, direction, excludeFirstValue
    }

    values[name] = target

    this.props.setLoading(true)
    this.totalPerUser = {}
    getResults(this.state.selectedNumber, values)
      .then((res) => {
        this.setState({dataToShow: res, [name]: target})
        this.props.setLoading(false)
      })
  }

  monthPickerChange = ({month, year}) => {
    const {firstValue, secondValue, thirdValue, direction, excludeFirstValue} = this.state
    const values = {
      firstValue, secondValue, thirdValue, direction, excludeFirstValue
    }
    this.totalPerUser = {}
    this.props.setLoading(true)
    getResults({month: month, year}, values)
      .then((res) => {
        this.setState({dataToShow: res, selectedNumber: {month, year}})
        this.hourPerMonth = this.getMonthHours({month, year})
        this.props.setLoading(false)
      })
  }

  toFixed = (number) => {
    if (number !== undefined) {
      return +number % 1 * 10 >= 1
        ? +number.toFixed(1)
        : +number.toFixed(0)
    }

  }

  excludeProject = (project) => {
    const {excludeFirstValue} = this.state
    const excludeProjects = excludeFirstValue.includes(project)
      ? excludeFirstValue.filter((p) => p !== project)
      : excludeFirstValue.concat(project)
    this.selectTypeOnChange('excludeFirstValue', excludeProjects)
  }

  render () {
    this.totalPerUser = {}
    this.usefulTotalPerUser = {}
    this.total = 0

    return (
      <section className="userList_wrap">
        <Title title={this.state.title}/>
        <div className="param_resul_list">
          <div className='form-group picker'>
            <span>Дата:</span>
            <MonthPicker setDate={this.monthPickerChange}/>
          </div>
          <div className='form-group'>
            <span>Строка:</span>
            <Select
              name="firstValue"
              onChange={(label) => this.selectTypeOnChange('firstValue', label)}
              options={[
                {value: 'client', label: 'Клієнт'}]}
              placeholder="Первый параметр"
              simpleValue
              value={this.state.firstValue}
              clearable={false}
            />
          </div>
          <div className='form-group'>
            <span>Столбец:</span>
            <Select
              name="secondValue"
              onChange={(label) => this.selectTypeOnChange('secondValue', label)}
              options={[
                {value: 'user', label: 'Співробітник'},
                {value: 'department', label: 'Відділ'},
                {value: 'project', label: 'Продукт', disabled:this.state.firstValue === 'project'},
                ]}
              placeholder="Второй параметр"
              simpleValue
              value={this.state.secondValue}
              clearable={false}
            />
          </div>
          <div className='form-group'>
            <span>Ячейка:</span>
            <Select
              name="thirdValue"
              onChange={(label) => this.selectTypeOnChange('thirdValue', label)}
              options={[
                {value: 'time', label: 'Час'},
                {value: 'money', label: 'Гроші'},
                {value: 'moneyWithoutGeneral', label: 'Гроші(без заг. год)'}]}
              placeholder="Ячейка"
              simpleValue
              value={this.state.thirdValue}
              clearable={false}
            />
          </div>
          <div className='form-group'>
            <span>Направление:</span>
            <Select
              name="direction"
              onChange={(label) => this.selectTypeOnChange('direction', label)}
              options={[
                {value: 0, label: 'Всi'},
                {value: '2', label: 'Політика'},
                {value: '1', label: 'Маркетинг'},
                {value: '3', label: 'Загальногосподарські'}]}
              placeholder="Направление"
              simpleValue
              value={this.state.direction}
              clearable={false}
            />
          </div>
        </div>

        <div id="fixed-table-container" className="table_overflow">
          <table className="table table-bordered table-hover result-table">
            <thead>
            <tr>
              <th>{this.state.firstValue} \ <br/> {this.state.secondValue}
                <div style={{width: '250px'}}/>
              </th>
              {this.state.dataToShow.secondValue.map((item) => {
                if (this.state.secondValue === 'user') {
                  return (<th key={item.id}>{item.surname} <br/>{item.name}</th>)
                }
                return (<th key={item.id}>{item.name}</th>)
              })}
              <th>Назагал</th>
            </tr>
            </thead>
            <tbody>
            {this.state.dataToShow.firstValue.sort((a, b) => {
              if (a.direction === +this.state.direction && b.direction === +this.state.direction || !this.state.direction) {
                return a.name < b.name ? -1 : 1
              } else {
                return a.direction === +this.state.direction ? -1 : 1
              }

            }).map((firstItem) => {
              let totalTimeFirstValue = 0
              const {firstValue, secondValue} = this.state
              return (<tr key={firstItem.id}
                          className={classnames({'other-direction': firstItem.direction !== +this.state.direction})}>
                <td>
                  {this.state.thirdValue !== 'time' &&
                  <span onClick={() => this.excludeProject(firstItem.id || firstItem._id)}>
                      <i
                        className={`fa ${this.state.excludeFirstValue.includes(firstItem.id || firstItem._id) ? 'fa-minus-square' : 'fa-plus-square'}`}/>
                    </span>
                  }
                  {firstItem.name}

                </td>
                {this.state.dataToShow.secondValue.map((secondItem) => {
                  let matchItem = {}
                  if (this.state.secondValue === 'department') {
                    matchItem.value = this.state.dataToShow.thirdValue.reduce((reducer, time) => {
                      if (time[firstValue] && time[firstValue] === firstItem._id && time[secondValue] === secondItem._id) {
                        return reducer + time.value
                      }
                      return reducer
                    }, 0)
                    matchItem.value = +matchItem.value.toFixed(2)
                  } else if (this.state.secondValue === 'project') {
                    const item = this.state.dataToShow.thirdValue.find(item => item.client === firstItem.id && item.project === secondItem.name);
                    matchItem.value = item ? item.value : 0;
                  } else {
                    matchItem = this.state.dataToShow.thirdValue.find(i => {
                      return i[firstValue] && i[firstValue] === firstItem._id && i[secondValue] === secondItem._id
                    })
                  }

                  if (!matchItem || !matchItem.value) return (<td key={secondItem.id}>-</td>)

                  if (!this.totalPerUser.hasOwnProperty(secondItem.id)) {
                    this.totalPerUser[secondItem.id || secondItem.name] = 0
                    this.usefulTotalPerUser[secondItem.id || secondItem.name] = 0
                  }
                  this.totalPerUser[secondItem.id || secondItem.name] += matchItem.value
                  this.usefulTotalPerUser[secondItem.id || secondItem.name] += matchItem.value
                  totalTimeFirstValue += matchItem.value
                  this.total += matchItem.value

                  return (<td key={secondItem.id}>{this.toFixed(matchItem.value)}</td>)
                })}
                <td>{this.toFixed(totalTimeFirstValue)}</td>
              </tr>)
            })}
            {this.state.dataToShow.general && this.state.dataToShow.general.map((work) => {
              let totalTimeFirstValue = 0
              const {secondValue} = this.state
              return (<tr key={work.id} className="other-direction">
                <td>{work.name}</td>
                {this.state.dataToShow.secondValue.map((secondItem) => {
                  let matchItem = {}

                  if (this.state.secondValue === 'department') {
                    matchItem.value = this.state.dataToShow.thirdValue.reduce((reducer, i) => {
                      if (i['type_of_time']
                        && i['type_of_holiday'] === work.slug
                        && i[secondValue] === secondItem._id) {
                        return reducer + i.value
                      }
                      return reducer
                    }, 0)
                    matchItem.value = +matchItem.value.toFixed(2)
                  } else {
                    matchItem = this.state.dataToShow.thirdValue.find(i => {
                      return i['type_of_time']
                        && i['type_of_holiday'] === work.slug
                        && i[secondValue] === secondItem._id
                    })
                  }
                  if (!matchItem || !matchItem.value) return (<td key={secondItem.id}>-</td>)

                  if (!this.totalPerUser.hasOwnProperty(secondItem.id)) {
                    this.totalPerUser[secondItem.id] = 0
                    this.usefulTotalPerUser[secondItem.id] = 0
                  }
                  this.totalPerUser[secondItem.id] += matchItem.value
                  this.usefulTotalPerUser[secondItem.id] += matchItem.value
                  totalTimeFirstValue += matchItem.value
                  this.total += matchItem.value

                  return (<td key={secondItem.id}>{this.toFixed(matchItem.value)}</td>)
                })}
                <td>{this.toFixed(totalTimeFirstValue)}</td>
              </tr>)
            })
            }
            {this.state.thirdValue === 'time' &&
            this.state.dataToShow.holiday.map((holiday) => {
              let totalTimeFirstValue = 0
              const {secondValue} = this.state
              return (<tr key={holiday.slug} className="other-direction">
                <td>{holiday.name}</td>
                {this.state.dataToShow.secondValue.map((secondItem) => {
                  let matchItem = {}

                  if (this.state.secondValue === 'department') {
                    matchItem.value = this.state.dataToShow.thirdValue.reduce((reducer, i) => {
                      if (i['type_of_time']
                        && i['type_of_holiday'] === holiday.slug
                        && i[secondValue] === secondItem._id) {
                        return reducer + i.value
                      }
                      return reducer
                    }, 0)
                    matchItem.value = +matchItem.value.toFixed(2)
                  } else {
                    matchItem = this.state.dataToShow.thirdValue.find(i => {
                      return i['type_of_time']
                        && i['type_of_holiday'] === holiday.slug
                        && i[secondValue] === secondItem._id
                    })
                  }
                  if (!matchItem || !matchItem.value) return (<td key={secondItem.id}>-</td>)

                  if (!this.totalPerUser.hasOwnProperty(secondItem.id)) {
                    this.totalPerUser[secondItem.id] = 0
                  }
                  this.totalPerUser[secondItem.id] += matchItem.value
                  totalTimeFirstValue += matchItem.value
                  this.total += matchItem.value

                  return (<td key={secondItem.id}>{this.toFixed(matchItem.value)}</td>)
                })}
                <td>{this.toFixed(totalTimeFirstValue)}</td>
              </tr>)
            })
            }
            <tr>
              <td>Назагал</td>
              {this.state.dataToShow.secondValue.map((secondItem) => {
                //total of all logget time
                if (this.state.thirdValue !== 'time' && secondItem.salary) {
                  return <td
                    className={classnames({'red': !+secondItem.totalTime || !this.totalPerUser[secondItem.id]})}
                    key={secondItem.id}>
                    {secondItem.salary}
                  </td>
                } else if (this.state.secondValue === 'project') {
                  return  <td>{ this.state.dataToShow.thirdValue.reduce((total, item) => {
                    if (secondItem.name === item.project ) {
                      return this.toFixed(total + item.value);
                    } return  total;
                  },0)}</td>
                } else if (this.totalPerUser[secondItem._id]) {
                  this.totalPerUser[secondItem._id] = this.toFixed(this.totalPerUser[secondItem._id])
                  return <td key={secondItem.id}>{this.totalPerUser[secondItem._id]}</td>
                }
                else {
                  return <td key={secondItem.id}>0</td>
                }

              })}

              <td>{this.state.dataToShow.secondValue.reduce((reducer, secondItem) => {
                if (this.state.thirdValue !== 'time' && secondItem.salary) {
                  return reducer + secondItem.salary
                } else if (this.totalPerUser[secondItem._id || secondItem.name]) {
                  return reducer + this.totalPerUser[secondItem._id || secondItem.name]
                } else {
                  return reducer
                }
              }, 0).toFixed()}</td>
            </tr>

            {this.state.thirdValue === 'time' && <tr className="total">
              <td>
                <div>Корисні години</div>
                <div>Норма годин на місяць</div>
                <div>Фактична норма годин на місяць %</div>
                {this.state.firstValue === 'client' && this.state.secondValue === 'user' && this.state.thirdValue === 'time' &&
                <div>Оцінка</div>}
              </td>

              {this.state.dataToShow.secondValue.map(({id}) => {
                const rows = []
                rows.push(<div key={id + '_usefulTotalPerUser'}>{this.toFixed(this.usefulTotalPerUser[id]) || 0}</div>)
                rows.push(<div key={id + '_hours_per_month'}>{this.toFixed(this.hourPerMonth)}</div>)

                let group = 1
                const percent = (100 / this.hourPerMonth) * this.totalPerUser[id] || 0
                rows.push(<div key={id + '_percent'}>{Math.floor(percent)}%</div>)
                if (percent > 79) {
                  group = 2
                }

                if (percent > 100) {
                  group = 3
                }

                if (this.state.firstValue === 'client' && this.state.secondValue === 'user') {
                  rows.push(<div key={id + '_group'} className={`group${group}`}>{group}</div>)
                }

                return <td key={id}>{rows}</td>
              })}
              <td>-</td>
            </tr>}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
}

export default ProjectsList
