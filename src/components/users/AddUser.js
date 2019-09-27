import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getOptions, addOrUpdateUser } from '../../actions/users.action'
import { validateUserForm } from '../../validations/users'
import UserForm from './UserForm'

class AddUser extends Component {
  constructor(props) {
    super(props)
    const user = this.props.user || {}
    let { direction, department, position, role, clients, projects, works } = user
    direction = direction && direction.id
    department = department && department._id
    position = position && position._id
    role = role && role._id
    let date = new Date()
    if (user.start_date) date = new Date(user.start_date)
    const salary_history = user.salary_history &&
      user.salary_history.map(({ date, ...other }) => ( { date: new Date(date), ...other } ))
        .sort((a, b) => a.date > b.date ? 1 : -1)
    this.state = {
      title: "Додати співробітника",
      resError: '',
      errors: '',
      selectedOptions: {
        f_name: user.name || '',
        l_name: user.surname || '',
        middlename: user.middlename || '',
        selectedDirection: direction || '',
        selectedDepartment: department || '',
        selectedPosition: position || '',
        selectedRole: role || '',
        selectedClients: clients || [],
        selectedProjects: projects || [],
        startDate: date.toISOString().replace(/T.*/, ''),
        email: user.email || '',
      },
      salary_history: salary_history || [],
      selectedWorks: works || [],
    }
  }

  isValid() {
    const data = {
      ...this.state
    }
    const { errors, isValid } = validateUserForm(data)
    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  componentDidMount = () => {

    //Loader (start)
    this.props.setLoading(true)
    this.props.getOptions(this.props.setLoading)
    this.chooseTitleText(this.props.location.pathname, this.state)
  }

  chooseTitleText = (pathname, state) => {

    if (pathname.includes('users/edit/')) {
      this.setState({
        ...state,
        title: `Редагування співробітника ${this.props.user.surname} ${this.props.user.name}`
      })
    }
  }
  inputHandleOnChange = (e) => {
    const selectedOptions = Object.assign({}, this.state.selectedOptions)
    selectedOptions[ e.target.name ] = e.target.value
    this.setState({ selectedOptions })
  }
  handleCheck = (projectID, workId) => {
    let selectedWorks = this.state.selectedWorks.slice()
    let initialWorkIndex = this.props.options.works.findIndex((i) => i.id === workId)
    let indexExistWork = selectedWorks.findIndex((i) => i.project === projectID && i.id === workId)
    let newWork = Object.assign({}, this.props.options.works[ initialWorkIndex ])
    newWork.project = projectID
    if (indexExistWork >= 0) {
      selectedWorks.splice(indexExistWork, 1)
    } else {
      selectedWorks.push(newWork)
    }
    this.setState({ selectedWorks })
  }
  handleSelect = (field, value) => {
    const selectedOptions = Object.assign({}, this.state.selectedOptions)
    selectedOptions[ `selected${field}` ] = value
    let selectedWorks
    if (field === 'Department') {
      selectedOptions.selectedPosition = null
    }
    if (field === 'Position') {
      selectedWorks = this.state.selectedWorks.filter((work) => {
        const optionWorks = this.props.options.works.filter(i => i.position === value).map(i => i.id)
        return optionWorks.includes(work.id)
      })
    }
    const dataToUpdate = { selectedOptions }
    if (selectedWorks) {
      dataToUpdate.selectedWorks = selectedWorks
    }
    this.setState(dataToUpdate)
  }
  handleSelectMulti = (field, value) => {
    const selectedOptions = Object.assign({}, this.state.selectedOptions)
    let selectedWorks
    selectedOptions[ `selected${field}` ] = value.split(',')
    if (field === 'Clients' && this.props.options.projects.length) {
      selectedWorks = this.state.selectedWorks.filter((work) => {
        const optionProject = this.props.options.projects.find(i => i.value === work.project)
        if (!optionProject) return
        return selectedOptions.selectedClients.includes(optionProject.client)
      })
      selectedOptions.selectedProjects = selectedOptions.selectedProjects.filter(project => {
        const optionProject = this.props.options.projects.find(i => i.value === project)
        if (!optionProject) return
        return selectedOptions.selectedClients.includes(optionProject.client)
      })
    }
    if (field === 'Projects') {
      selectedWorks = this.state.selectedWorks.filter((work) => {
        const optionProject = this.props.options.projects.find(i => i.value === work.project)
        if (!optionProject) return
        return selectedOptions.selectedProjects.includes(optionProject.value)
      })
    }
    const dataToUpdate = { selectedOptions }
    if (selectedWorks) {
      dataToUpdate.selectedWorks = selectedWorks
    }
    this.setState(dataToUpdate)
  }
  onChangeSalary = (salary_history) => {
    return this.setState({ salary_history })
  }
  onChangeCurrentSalary = (salary) => {
    const now = new Date()
    const newSalaries = this.state.salary_history.slice()
    const existSalary = newSalaries.findIndex(i => i.date.getFullYear() === now.getFullYear() && i.date.getMonth() === now.getMonth())
    if (existSalary === -1) {
      newSalaries.push({
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        salary
      })
    } else {
      newSalaries[ existSalary ].salary = salary
    }
    this.setState({ salary_history: newSalaries })
  }

  onSubmit = (e) => {
    e.preventDefault()

    if (this.isValid()) {

      this.setState({ errors: {}, resError: '', isLoading: true })

      const data = {
        email: this.state.selectedOptions.email,
        name: this.state.selectedOptions.f_name,
        middlename: this.state.selectedOptions.middlename,
        surname: this.state.selectedOptions.l_name,
        role: this.state.selectedOptions.selectedRole,
        department: this.state.selectedOptions.selectedDepartment,
        direction: this.state.selectedOptions.selectedDirection,
        position: this.state.selectedOptions.selectedPosition,
        works: this.state.selectedWorks,
        salary_history: this.state.salary_history.map(({date, salary})=> ({date: new Date(date.getFullYear(), date.getMonth()), salary})),
        start_date: this.state.selectedOptions.startDate,
        clients: this.state.selectedOptions.selectedClients[ 0 ] === "" ? [] : this.state.selectedOptions.selectedClients, // it needs coz of onChange method witch put
        projects: this.state.selectedOptions.selectedProjects[ 0 ] === "" ? [] : this.state.selectedOptions.selectedProjects, // "" to empty array
      }

      if (this.props.userId) {
        data.id = this.props.userId
      }

      addOrUpdateUser(data)
        .then(() => this.props.history.push('/users'))
        .then(() => {
          if(data.id !== undefined){
            return this.props.setSuccess('Співробітника було успішно відредаговано');
          }else{
            return this.props.setSuccess('Співробітника було успішно додано');
          }
        })
        .catch((err) => {
          this.props.setError(err);
          this.setState({isLoading: false});
        });

    }
  }

  // ..methods
  render() {

    return (
      <UserForm
        title={this.state.title}
        inputHandleOnChange={this.inputHandleOnChange}
        handleSelect={this.handleSelect}
        HandleOnSubmit={this.onSubmit}
        handleCheck={this.handleCheck}
        handleSelectMulti={this.handleSelectMulti}
        onChangeSalary={this.onChangeSalary}
        onChangeCurrentSalary={this.onChangeCurrentSalary}
        errors={this.state.errors}
        selectedWorks={this.state.selectedWorks}
        role={this.props.role}
        salary_history={this.state.salary_history}
        {...this.state.selectedOptions}
        {...this.props.options}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.user.options,
    role: state.auth.user.role.slug,

  }
}
const mapDispatchToProps = dispatch => {
  return {
    getOptions: loader => dispatch(getOptions(loader)),
  }
}

//

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddUser))
