import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { importWorksectionInformation, getAllUsers } from '../../actions/users.action';
import { getAllClients } from '../../actions/client.action';

import Title from '../Title';
import Select from 'react-select';
import MonthPicker from '../elements/monthPicker';
import UserTable from '../UserTable';

class WorksectionImportTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: 'Імпорт часу з Worskection, cпівробітники',
        loading: false,
        selectedDate: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        },
        postmen_users: [],
        postmen_projects: [],
        association: [],
        project_association: []
    }
  }

  componentDidMount = async () => {
    this.props.setLoading(true);

    // get users
    this.props.getAllUsers(this.props.setLoading);

    // get clients/projects
    this.props.getAllClients(this.props.setLoading);
    
    // get projects/users from worksection
    let information = await importWorksectionInformation(this.state.selectedDate);
    this.props.importWorksectionInformation(information);

    this.setState({...this.makeAssociations()});
  };

  makeAssociations = () => {
    const { time, projects } = this.props.worksection;
    const association = this.state.association.slice();

    // make users associations
    const postmen_users = this.props.users.map(user => {
        return {
            value: user.id,
            label: `${user.name} ${user.surname}`,
            email: user.email
        }
    });

    time.forEach((worksection_user)=>{
        const assoc = association.find((item)=> item.field === 'user' 
                && item.worksection === worksection_user.email);

        if(!assoc){
            let value = postmen_users.find((postmen_user) => postmen_user.email === worksection_user.email);
            value = value && value.value || null;
            association.push({
                worksection: worksection_user.email,
                id: value,
                field: 'user'
            })
        }
    });
    // end make users associations

    // make projects associations
    const postmen_projects = this.props.clients.map(project => {
        return {
            value: project.id,
            label: project.name
        }
    });

    projects.forEach( worksection_project => {
        const assoc = association.find((project)=> project.field === 'project' 
        && project.worksection === worksection_project);

        if(!assoc){
            let value = postmen_projects.find((postmen_project) => postmen_project.label === worksection_project);
            value = value && value.value || null;
            association.push({
                worksection: worksection_project,
                id: value,
                field: 'project'
            })
        }
    });
    // end make projects associations

    return {
        postmen_users,
        postmen_projects,
        association
    }
  }

  fillUserTime = () => {
        const { time } = this.props.worksection;
        const { postmen_users, association } = this.state;

        return time.map(user => {
            const value = association.find((item)=> item.worksection === user.email);

            return(
                <tr key={ user.email }>
                    <td>{ user.name }</td>
                    <td>{ user.email }</td>
                    <td>{ user.time.formated_number }</td>
                    <td>
                        <Select
                            options={postmen_users}
                            placeholder="Співробітник"
                            simpleValue
                            onChange={(user_id) => {
                                const association = this.state.association.slice();
                                const assocIndex = association.findIndex((assoc)=> assoc.field === 'user' && assoc.worksection === user.email)
                                association[assocIndex] = {
                                    ...association[assocIndex],
                                    id: user_id
                                }
                            
                                this.setState({association});
                            }}
                            value={value && value.id || null}
                        />
                    </td>
                </tr>
            )
        });
    }

    fillProjectsTable = () => {
        const { projects } = this.props.worksection;
        const { postmen_projects, association } = this.state;

        return projects.map(project => {
            const value = association.find((item)=> item.worksection === project);

            return(
                <tr key={ project }>
                    <td>{ project }</td>
                    <td>
                        <Select
                            options={postmen_projects}
                            placeholder="Продукт"
                            simpleValue
                            onChange={(project_id) => {

                                const association = this.state.association.slice();
                                const assocIndex = association.findIndex((assoc) => 
                                    assoc.field === 'project' && assoc.worksection === project);
                                association[assocIndex] = {
                                    ...association[assocIndex],
                                    id: project_id
                                }

                            }}
                            value={value && value.id || null}
                            />
                    </td>
                </tr>
            )
        });
    }

    monthPickerChange = ({month, year}) => {
        this.setState({selectedDate: {month, year}});
    }
    
    importButtonHandler = async () => {
        this.props.setLoading(true);

        let information = await importWorksectionInformation(this.state.selectedDate);
        this.props.importWorksectionInformation(information);

        this.props.setLoading(false);
    }

    generateTablButtonHandler = () => {
        // '/users/worksection/time-table'
        console.log('save')
        this.props.history.push('/users/worksection/time-table');
    }

    render() {
        const { time, projects } = this.props.worksection;

        return (
            <section className="userList_wrap">
                <Title title={this.state.title}/>
                <span>
                    Первірте, або оберіть відповідність співробітників з Worksetion до існуючих
                </span>

                <div className="param_resul_list">
                    <MonthPicker setDate={this.monthPickerChange}/>
                    <button className="inp_div btn btn-primary btn-add" onClick={this.importButtonHandler}>Імпорт</button>
                </div>

                <UserTable />

                {(projects && projects.length !== 0) && (
                <div className="table_wrap">
                    <h3>Перевірте, або оберіть відповідність продуктiв з Worksetion до існуючих</h3>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Worksection</th>
                                <th>Postmen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.fillProjectsTable()}
                        </tbody>
                    </table>
                </div>)}

                <div>
                    <Link to="/users" className="inp_div btn btn-primary btn-add">Відміна</Link>
                    <Link to="/users/worksection/time-table" className="inp_div btn btn-primary btn-add">Сформувати таблицю (tets)</Link>
                    <button className="inp_div btn btn-primary btn-add" onClick={this.generateTablButtonHandler}>Сформувати таблицю</button>
                </div>

            </section>
        )
    }
}

export default withRouter(connect(
    state => ({
        worksection: state.user.worksection,
        users: state.user.users,
        clients: state.client.clients
    }),
    dispatch => ({
        importWorksectionInformation: (data) => {
            dispatch({type: 'SET_WORKSECTION_INFORMATION', payload: data})
        },
        getAllUsers: (loader) => {
            dispatch(getAllUsers(loader))
        },
        getAllClients: (loader) => {
            dispatch(getAllClients(loader))
        }
    })
)(WorksectionImportTime))
