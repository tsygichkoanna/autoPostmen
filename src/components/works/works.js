import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { getWorks, saveOrUpdateWork, deleteWork } from '../../actions/work.action'

import Title from '../Title'
import PopoverForm from '../positions/PopoverForm'

class Works extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: 'Види робот',
      works: []
    }
  }

  componentDidMount () {
    this.getWorksList()
  }

  getWorksList = () => {
    this.props.setLoading(true)
    return getWorks()
      .then((res) => {
        this.setState({ works: res.data.sort((a, b) => a.code < b.code ? -1 : 1) })
        this.props.setLoading(false)
      })
      .catch((error) => {
        this.props.setLoading(false)
        this.props.setError(error.message)
      })
  }

  onChange = (field, index, event) => {
    const works = this.state.works.slice()
    works[index][field] = event.target.value
    this.setState({ works })
  }
  updateWork = (index, id) => {
    this.props.setLoading(true)
    saveOrUpdateWork({ ...this.state.works[index], id })
      .then(() => {
        this.props.setSuccess(`Работа "${this.state.works[index].name} ${this.state.works[index].code}"  обнавлена`)
        this.getWorksList()
      })
      .catch((err) => this.props.setError(err.message))
  }
  addWork = (work) => {
    this.props.setLoading(true)
    saveOrUpdateWork(work)
      .then(() => {
        this.getWorksList()
      })
      .then(() => this.props.setSuccess('Роботу було успішно додано'))
      .catch((err) => this.props.setError(err.message))
  }
  onDeleteWork = (index, id) => {
    if (!id) {
      const works = this.state.works.slice()
      works.splice(index, 1)
      return this.setState({ works })
    }
    this.props.setLoading(true)
    deleteWork(id)
      .then(() => {
        this.props.setSuccess(`Работа "${this.state.works[index].name} ${this.state.works[index].code}" удалена`)
        this.getWorksList()
      })
      .catch(() => {
        this.props.setLoading(false)
      })
  }

  render () {
    return (
      <section className="positions_wrap">
        <Title title={this.state.title}/>
        <PopoverForm type="addWork" onAddWork={this.addWork} setLoading={this.props.setLoading}/>
        <div className="table_overflow">
          <table className="table table-bordered table-hover edit-works types-table">
            <thead>
            <tr>
              <th>Назва</th>
              <th>Код</th>
              <th>Зберегти зміни</th>
              <th>Видалити</th>
            </tr>
            </thead>
            <tbody>
            {this.state.works.map((job, index) => {
              return <tr key={index}>
                <td><input type="text" value={job.name} onChange={(event) => this.onChange('name', index, event)}/></td>
                <td><input type="text" value={job.code} onChange={(event) => this.onChange('code', index, event)}/></td>
                <td>
                  <button className="save" onClick={() => this.updateWork(index, job.id)}><i
                    className="fa fa-cloud-download"/>
                  </button>
                </td>
                <td>
                  <PopoverForm type="delJob" setLoading={this.props.setLoading}
                               onDeleteWork={() => this.onDeleteWork(index, job.id)} data_name={job.name}
                               data_id={job.id}/>
                </td>
              </tr>
            })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
}

export default withRouter(connect(
  null,
  null)(Works))
