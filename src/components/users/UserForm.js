import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import Title from '../Title'
import TextFieldGroup from '../common/TextFieldGroup'
import Select from 'react-select'
import cx from 'classnames'
import MonthPicker from '../elements/monthPicker'
import SalaryModal from './SalaryModal'

class UserForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
    }
  }

  renderSelectedClient = (clients, projects, selectedClients) => {
    if (selectedClients.length) {
      return selectedClients.map((clientID, index) => {
        let label = ''
        try {
          label = clients.filter(i => i.value === clientID)[ 0 ].label
        } catch (e) {
          return null
        }
        return (
          <tr key={clientID}>
            <td>{index + 1}</td>
            <td><Link target="_blank" to={`/clients/edit/${clientID}`}>{label}</Link></td>
            <td>{projects.filter(p => p.client === clientID).length}</td>
          </tr>
        )
      })
    }
  }

  getCurrentSalary(salary_history) {
    const now = new Date()
    const currentSalary = salary_history.find(i => {
      const date = new Date(i.date)
      return date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
    })
    return currentSalary ? currentSalary.salary : 0
  }

  renderAvailableJobs = (works, selectedWorks, projectID, selectedPosition, selectedProjects) => {
    if (selectedProjects.length) {
      return works.map((work) => {
        let checked
        try {
          checked = selectedWorks.filter((i) => i.project === projectID && i.id === work.id)[ 0 ]
        } catch (e) {
          checked = false
        }
        return (
          <tr key={work.id}>
            <td className={cx(' checkbox_wrap')}>
              <label htmlFor={'' + projectID + work.id}>{work.name}</label>
            </td>
            <td>
              <input
                id={'' + projectID + work.id}
                onChange={() => this.props.handleCheck(projectID, work.id)}
                type="checkbox"
                name={projectID}
                checked={checked}
              />
            </td>
            <td>{work.code}</td>
          </tr>
        )
      })
    } else {
      return (
        <tr>
          <td colSpan="2">
            <div className="alert-warning">Виберіть Посаду та Продукт</div>
          </td>
        </tr>
      )
    }
  }
  renderSelectedProjects = (selectedProjects, projectsOptions, works, selectedWorks, selectedPosition, projects) => {
    if (selectedProjects.length) {
      return selectedProjects.map((projectID) => {
        let label = ''
        try {
          label = projects.filter(i => i.value === projectID)[ 0 ].label
        } catch (e) {
          return null
        }
        return (
          <table key={projectID} className="table table-bordered table-hover">
            <thead>
            <tr>
              <th colSpan="2">{label}</th>
            </tr>
            </thead>
            <tbody>
            {this.renderAvailableJobs(works, selectedWorks, projectID, selectedPosition, selectedProjects)}
            </tbody>
          </table>
        )
      })
    }
  }
  onModalChange = (modalIsOpen) => {
    this.setState({ modalIsOpen })
  }

// .. methods
  render() {
    const {
      resError, errors,
      f_name, l_name, middlename,
      selectedDirection, directions,
      selectedDepartment, departments,
      selectedPosition, positions,
      selectedRole,
      selectedClients, clients,
      selectedProjects, projects: allProjects,
      selectedWorks, works,
      salary_history, startDate,
      email
    } = this.props
    const projects = allProjects.filter(project => selectedClients.includes(project.client))
    let { roles } = this.props
    if (this.props.role === 'jadmin') {
      roles = roles.filter(i => i.label !== 'Admin')
    }
    return (
      <section className="addUser_wrap">
        <Title title={this.props.title}/>
        <div className="form_wrap">
          <form onSubmit={this.props.HandleOnSubmit}>
            {resError && <div className="alert alert-danger">{resError}</div>}
            <TextFieldGroup
              field="f_name"
              label="Ім’я"
              value={f_name}
              error={errors.f_name}
              onChange={this.props.inputHandleOnChange}
              //
            />
            <TextFieldGroup
              field="l_name"
              label="Прізвище"
              value={l_name}
              error={errors.l_name}
              onChange={this.props.inputHandleOnChange}
            />
            <TextFieldGroup
              field="middlename"
              label="По батькові"
              value={middlename}
              error={errors.middlename}
              onChange={this.props.inputHandleOnChange}
              //
            />
            <div className={cx('form-group', { 'has-error': errors.direction })}>
              <label>Напрям</label>
              <Select
                name="direction"
                onChange={(value) => this.props.handleSelect('Direction', value)}
                options={directions}
                placeholder="Напрям"
                simpleValue
                value={selectedDirection}
              />
              {errors.direction && <span className="help-block">{errors.direction}</span>}
            </div>
            <div className={cx('form-group', { 'has-error': errors.department })}>
              <label>Відділ</label>
              <Select
                name="department"
                onChange={(value) => this.props.handleSelect('Department', value)}
                options={departments}
                placeholder="Відділ"
                simpleValue
                value={selectedDepartment}
              />
              {errors.department && <span className="help-block">{errors.department}</span>}
            </div>
            <div className={cx('form-group', { 'has-error': errors.position })}>
              <label>Посада (відповідно до обраного відділу)</label>
              <Select
                name="position"
                onChange={(value) => this.props.handleSelect('Position', value)}
                options={positions.filter((i) => i.department === selectedDepartment)}
                placeholder="Посада"
                simpleValue
                value={selectedPosition}
              />
              {errors.position && <span className="help-block">{errors.position}</span>}
            </div>
            <div className={cx('form-group', { 'has-error': errors.role })}>
              <label>Роль</label>
              <Select
                name="role"
                onChange={(value) => this.props.handleSelect('Role', value)}
                options={roles}
                placeholder="Роль"
                simpleValue
                value={selectedRole}
              />
              {errors.role && <span className="help-block">{errors.role}</span>}
            </div>
            <div className={cx('form-group', { 'has-error': errors.clients })}>
              <label>Клієнти</label>
              <Select
                name="clients"
                onChange={(value) => this.props.handleSelectMulti('Clients', value)}
                options={clients}
                multi
                placeholder="Клієнти"
                simpleValue
                value={selectedClients.join(',')}
              />
              {errors.clients && <span className="help-block">{errors.clients}</span>}
            </div>
            <label>Додано {selectedClients[ 0 ] !== "" ? selectedClients.length : 0} клієнтів</label>
            <table className="table table-bordered table-hover">
              <thead>
              <tr>
                <th>№</th>
                <th>клієнт</th>
                <th>Кількість продуктів</th>
              </tr>
              </thead>
              <tbody>
              {this.renderSelectedClient(clients, projects, selectedClients)}
              </tbody>
            </table>
            <div className={cx('form-group', { 'has-error': errors.projects })}>
              <label>Продукти</label>
              <Select
                name="projects"
                onChange={(value) => this.props.handleSelectMulti('Projects', value)}
                options={projects}
                placeholder="Продукти"
                simpleValue
                multi
                value={selectedProjects.join(',')}
              />
              {errors.projects && <span className="help-block">{errors.projects}</span>}
            </div>
            <label>Додано {selectedProjects[ 0 ] !== "" ? selectedProjects.length : 0} продуктів</label>

            {this.renderSelectedProjects(selectedProjects, projects, works, selectedWorks, selectedPosition, projects)}

            {this.props.role !== 'jadmin' &&
            <div className="row salary">
              <div className="col-xs-3 date">
                <label className="control-label">Дата</label>
                <MonthPicker
                  date={{ month: new Date().getMonth() + 1, year: new Date().getFullYear() }}
                  disabled
                />
              </div>
              <div className="col-xs-3">
                <TextFieldGroup
                  field="salary"
                  label='Зарплата'
                  type="number"
                  value={this.getCurrentSalary(salary_history)}
                  error={errors.salary}
                  onChange={(event) => this.props.onChangeCurrentSalary(
                    +event.target.value
                  )}
                />
              </div>
              <div className="salary-button col-xs-3">
                <button type="button" className="btn btn-primary"
                        onClick={() => this.onModalChange(true)}>Посмотреть
                </button>
              </div>
            </div>}
            <div className="row">
              <div className="col-xs-5">
                <TextFieldGroup
                  field="startDate"
                  label="Дата початку роботи компанії"
                  value={startDate}
                  error={errors.startDate}
                  onChange={this.props.inputHandleOnChange}
                  type="date"
                />
              </div>
            </div>
            <TextFieldGroup
              field="email"
              label="Email"
              value={email}
              error={errors.email}
              onChange={this.props.inputHandleOnChange}
            />
            <input id="save" type="submit" value="Зберегти" className="btn btn-primary"/>
            <Link to='/users' id="discard" type="submit" className="btn btn-discard">Відмінити</Link>
          </form>

          {this.state.modalIsOpen &&
          <SalaryModal salary_history={salary_history}
                       onClose={() => this.onModalChange(false)}
                       onChangeSalary={this.props.onChangeSalary}
          />
          }
        </div>
      </section>
    )
  }
}

export default withRouter(connect()(UserForm))
