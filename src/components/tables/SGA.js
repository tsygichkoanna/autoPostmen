import React, { Component } from 'react'
import { serverURI } from '../../config/urls.config'
import MonthPicker from '../elements/monthPicker'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import fixTable from '../../admin-lte/fixed-table-master/fixed-table'

class SGA extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSum: 0,
      lastSum: 0,
      users: [],
      projects: [],
      times: [],
      isOpen: false,
      month: null,
      year: null
    }
  }

  componentDidUpdate () {
    if (this.state.users) {
      fixTable(document.getElementById('fixed-table-container1'))
    }
  }

  componentDidMount () {
    this.monthPickerChange({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
  }

  toFixed = (number) => {
    return number % 1 * 10 >= 1
      ? number.toFixed(0)
      : number.toFixed(0)
  }

  addColumn = (proj, user, total = 0) => {
    const timeOfProject = this.state.times.find(time => time.user === user._id && proj._id === time.project)
    const allTimeUser = this.state.times.reduce((reducer, time) => time.user === user._id
      ? time.value + reducer
      : reducer
      , 0)
    const sumForUser = this.state.lastSum / this.state.users.length
    const SGA = timeOfProject ? sumForUser * 100000 * (timeOfProject.value * 100000 / allTimeUser) : '-'
    total += timeOfProject ? SGA / 10000000000 : 0
    return {
      total,
      render: <td key={user._id}>{timeOfProject ? this.toFixed(SGA / 10000000000) : '-'}</td>
    }
  }

  monthPickerChange = async ({ month, year }) => {
    const params = {
      month, year
    }
    try {
      const { data } = await axios.get(serverURI + '/api/tables/sga?token=' + localStorage.jwtToken,
        {
          params
        })
      const { projects, users, times, sum } = data
      this.setState({ projects, users, times, lastSum: sum, currentSum: sum, month, year })
    } catch (e) {
      console.error(e)
    }

  }

  handleChange = (e) => {
    this.setState({ currentSum: e.target.value })
  }

  saveSum = async (boolean) => {
    const { month, year } = this.state
    if (boolean) {
      await axios.post(serverURI + '/api/tables/sga?token=' + localStorage.jwtToken, {
        sum: this.state.currentSum,
        month,
        year
      })
      this.setState({ lastSum: this.state.currentSum, isOpen: false })
    } else {
      this.setState({ currentSum: this.state.lastSum, isOpen: false })
    }
  }

  openPopUp = () => {
    this.setState({ isOpen: true })
  }

  render () {

    return (
      <div className='userList_wrap'>
        <div className="param_resul_list">
          <MonthPicker setDate={this.monthPickerChange}/>
          <input className='form-control counter-input'
                 type='number'
                 onChange={this.handleChange}
                 value={this.state.currentSum}/>
          <div style={{ position: 'relative' }}>
            <input id="save" type="submit" value="Зберегти" className='btn btn-primary btn-save'
                   onClick={this.openPopUp}/>
            {this.state.isOpen &&
            <div className="popover_wrap">
              <Button type="submit" bsClass="btn btn-danger" onClick={() => this.saveSum(true)}>Змінити</Button>
              <Button type="reset" onClick={() => this.saveSum(false)} bsClass="btn btn-discard">Відмінити</Button>
            </div>
            }
          </div>

        </div>
        <div id="fixed-table-container1" className="table_overflow">
          {this.state.users &&
          <table className="table table-bordered table-hover result-table sga-table">
            <thead>
            <tr>
              <th>Продукти</th>
              {this.state.users.map(user => <th key={user._id}>{user.surname} <br/>{user.name} </th>)}
              <th>Загал</th>
            </tr>
            </thead>
            <tbody>
            {this.state.projects && this.state.projects.map(proj => {
                let total = 0
                return (<tr key={proj._id}>
                  <td>{proj.name}</td>
                  {this.state.users.map(user => {
                    const data = this.addColumn(proj, user, total)
                    total = data.total
                    return data.render
                  })}
                  <td>{this.toFixed(total)}</td>
                </tr>)
              }
            )}
            <tr>
              <td>Загал</td>
              {this.state.users && this.state.users.map(user => {
                const project = this.state.times.find(item => item.user === user._id)
                if (project) {
                  return (
                    <td key={user._id}>{this.toFixed(this.state.lastSum / this.state.users.length)}</td>
                  )
                } else {
                  return (
                    <td key={user._id}>0</td>
                  )
                }
              })}
              <td>
                {this.state.lastSum}
              </td>
            </tr>

            </tbody>

          </table>
          }
        </div>
      </div>
    )
  }
}

export default SGA
