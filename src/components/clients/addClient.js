import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { addNewClient, clearProjList, getDirectionsAndDepartments, setProjects } from '../../actions/client.action'
import { validateClientForm } from '../../validations/clients'
import ClientForm from './ClientForm'

const defaultsProjects = [
  {
    name: 'STRATEGY'
  },
  {
    name: 'CREATIVE'
  },
  {
    name: 'CLIENT SERVICE'
  },
  {
    name: 'VIDEO PRODUCTION'
  },
  {
    name: 'MEDIA'
  },
  {
    name: 'SOCIAL MEDIA'
  },
  {
    name: 'GRAPHIC DESIGN'
  },
];

class AddClient extends Component {
  constructor (props) {
    super(props)
    let name, direction, projects, directionId
    if (this.props.client) {
      name = this.props.client.name
      direction = this.props.client.direction.id
      projects = this.props.client.projects
    }
    if (projects) props.setProjects(projects)


    this.state = {
      errors: '',
      resError: '',
      name: name || '',
      direction: direction || '',
      directionOptions: [],
      triggerPopover: false,
      errProj: '',
      loading: false,
      editableProjects: []
    }
  }

    componentDidMount() {
        this.props.getDirectionsAndDepartments(this.props.setLoading).then(
            () => {
                this.props.departmens_directions.direction.forEach((el) => {
                    let direction = {};
                    direction.value = el.id;
                    direction.label = el.name;
                    this.setState({directionOptions: this.state.directionOptions.concat(direction)})
                })
            }
        )
    }

  componentWillUnmount () {
    this.props.clearProjList()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.projects !== this.props.projects) {
      this.setState({editableProjects: nextProps.projects});
    }
  }

// methods
  isValid () {
    const data = {
      'name': this.state.name,
      'direction': this.state.direction,
      'projects': this.state.editableProjects
    }
    const {errors, isValid} = validateClientForm(data)
    if (!isValid) {
      this.setState({errors})
    }
    return isValid
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSelectChange = (value) => {
    this.setState({direction: value})
  }

  onSubmit = (e) => {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({errors: {}, resError: '', isLoading: true})
      const client = {
        name: this.state.name,
        direction_id: this.state.direction,
        project: this.state.editableProjects.map(({name, id}) => ({name, id}))
      }

      if (this.props.id) client.id = this.props.id;

      if (client.project.length === 0) {
        this.setState({triggerPopover: true, errProj: 'Вам потрібно додати продукт'})
      } else {
        this.props.addNewClient(client).then(
          (res) => {
            this.props.history.push('/clients')
          },
          (err) => {
            this.props.setError(err.response.data.error);
            this.setState({isLoading: false});
          }
        ).then(() => {
          if(client.id !== undefined){
            this.props.setSuccess('Клієнта було успішно відредаговано');
          }else{
            this.props.setSuccess('Клієнта було успішно додано');
          }
        })
      }
    }
  }

  handleChangeActiveProduct = (event, project) => {
    const editableProjects = [...this.state.editableProjects];
    if(event.target.checked) {
      editableProjects.push(project);
    } else {
      const index = editableProjects.findIndex(item => item.name === project.name);
      editableProjects.splice(index,1);
    }
    this.setState({editableProjects});
  };

  checkActiveProduct = project => {
    return this.state.editableProjects.some( item =>  item.name === project.name);
  };

  render () {
    return (
      <ClientForm
        title="Додати кліента"
        HandleOnChange={this.onChange}
        handleSelectChange={this.handleSelectChange}
        HandleOnSubmit={this.onSubmit}
        {...this.state}
        handleChangeActiveProduct={this.handleChangeActiveProduct}
        checkActiveProduct={this.checkActiveProduct}
        defaultsProjects={defaultsProjects}

        setLoading={this.props.setLoading}
      />
    )
  }
}


const mapStateToProps = state => {
  return{
      projects: state.client.projects,
      departmens_directions: state.client.departmens_directions,
      cache_dd: state.client.cache_dd
  }
};
const mapDispatchToProps = dispatch => {
    return {
        addNewClient                : loader => dispatch(addNewClient(loader)),
        setProjects                 : loader => dispatch(setProjects(loader)),
        clearProjList               : loader => dispatch(clearProjList(loader)),
        getDirectionsAndDepartments : loader => dispatch(getDirectionsAndDepartments(loader))
    }
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddClient))
