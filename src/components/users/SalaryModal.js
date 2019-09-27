import React, { Component } from 'react'
import MonthPicker from '../elements/monthPicker'

class SalaryModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      salary_history: props.salary_history.slice(),
      newSalaryDate: new Date(),
      newSalary: 0,
      additionalFiled: false,
      error: false
    }
  }

  onAddSalary = (event, cb) => {
    if (!this.state.additionalFiled) {
      return this.setState({ additionalFiled: true })
    }
    const { salary_history, newSalary, newSalaryDate } = this.state
    const isDateExist = salary_history.find(i => i.date.getFullYear() === newSalaryDate.getFullYear()
      && i.date.getMonth() === newSalaryDate.getMonth())
    if (!!isDateExist) {
      return this.setState({ error: true })
    }
    const newSalaryHistory = salary_history.slice()
    newSalaryHistory.push({ date: newSalaryDate, salary: newSalary })
    return this.setState({ salary_history: newSalaryHistory, newSalaryDate: new Date(), newSalary: 0 }, cb)
  }
  onSaveSalary = () => {
    if (this.state.additionalFiled) {
      this.onAddSalary(null, () => {
        this.props.onChangeSalary(this.state.salary_history)
        this.props.onClose()
      })
    } else {
      this.props.onChangeSalary(this.state.salary_history)
      this.props.onClose()
    }
  }
  onChangeSalary = (date, salary) => {
    const dateObj = new Date(date.year, date.month, 1)
    const newSalaries = this.state.salary_history.slice()
    const existSalary = newSalaries.findIndex(i => i.date.getFullYear() === dateObj.getFullYear() && i.date.getMonth() === dateObj.getMonth())
    if (existSalary === -1) {
      newSalaries.push({
        date: new Date(dateObj.getFullYear(), dateObj.getMonth(), 1),
        salary: +salary
      })
    } else {
      newSalaries[ existSalary ] = {
        date: new Date(dateObj.getFullYear(), dateObj.getMonth(), 1),
        salary: +salary
      }
    }
    this.setState({ salary_history: newSalaries })
  }

  render() {
    const { salary_history, newSalary } = this.state
    return (
      <div className="modal" style={{ display: 'block' }}>
        <div className="modal-dialog salary-modal">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" onClick={this.props.onClose}>×</span></button>
              <h4 className="modal-title">Зарплата за весь час</h4>
            </div>
            <div className="modal-body">
              <table className="table salary-table">
                <tbody>
                {salary_history.map(({ date, salary }) => { // TODO: add sort
                  return <tr key={date}>
                    <td>
                      <MonthPicker
                        date={{ month: date.getMonth() + 1, year: date.getFullYear() }}
                        disabled
                      /></td>
                    <td><input type="number" min={0} value={salary} onChange={(event) => this.onChangeSalary(
                      {
                        month: date.getMonth(),
                        year: date.getFullYear()
                      },
                      event.target.value
                    )}/></td>
                  </tr>
                })}
                {this.state.additionalFiled &&
                <tr className="monthPick">
                  <td>
                    <div className="close-additional-field">
                      <i className="fa fa-close"
                         onClick={() => this.setState({
                           additionalFiled: false,
                           newSalaryDate: new Date(),
                           newSalary: 0,
                           error: false
                         })}/></div>
                    <MonthPicker
                      setDate={(value) => this.setState({ newSalaryDate: new Date(value.year, value.month - 1, 1) })}/>
                  </td>
                  <td><input type="number" value={newSalary}
                             onChange={(event) => this.setState({ newSalary: +event.target.value })}/>
                  </td>
                </tr>
                }
                <tr className="add-new">
                  <td>
                    <div onClick={this.onAddSalary}>
                      <i className="fa fa-plus"/> Додати
                    </div>
                  </td>
                  <td colSpan={2}> {this.state.error &&
                  <div className="has-error">
                    <span className="help-block">Ця дата вже існує</span>
                  </div>
                  }
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-discard pull-left"
                      onClick={this.props.onClose}>Відмінити
              </button>
              <button type="button" className="btn btn-primary"
                      onClick={this.onSaveSalary}>Зберегти
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SalaryModal
