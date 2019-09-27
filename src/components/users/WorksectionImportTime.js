import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { importWorksectionInformation, saveWorksectionTime } from '../../actions/users.action';
import { saveAssociations } from '../../actions/association.action';

import Title from '../Title';
import Select from 'react-select-plus';
import MonthPicker from '../elements/monthPicker';

import 'react-select-plus/dist/react-select-plus.css';
import fixTable from '../../admin-lte/fixed-table-master/fixed-table';

class WorksectionImportTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: 'Імпорт часу з Worskection, cпівробітники',
        loading: false,
        selectedDate: {
            month: new Date().getMonth() +1,
            year: new Date().getFullYear(),
        },
        associations_content: true,
        postmen_users: [],
        postmen_projects: [],

        association: [],
        time_to_save: [],

        empty_project_association: false,

        totalWorksectionTime: {
            total: 0,
            willAdd: 0,
            users: {},
            clients: {}
        },
        postmanUsersToShow: {}
    }
  }

  componentWillUnmount = () => {
      // clear store
      this.props.clearWorksectionInformation();
  }

  componentDidUpdate(){
      fixTable(document.getElementById('fixed-table-container1'));
  }

  makeAssociations = () => {
    const { wsUsers, worksection_clients, postmen_projects, postmen_users, associations } = this.props.worksection;
    const { clients } = this.props;
    const association = associations.slice();

    // make users associations
      wsUsers.forEach(worksection_user =>{
        const assoc = association.find(item => item.type === 'user'
                && item.worksection === worksection_user.email);

        if(!assoc){
            let value = postmen_users.find( postmen_user => postmen_user.email === worksection_user.email);
            value = (value && value.value) || null;
            association.push({
                worksection: worksection_user.email,
                postmen_id: value,
                type: 'user',

            });
        }
    });
    // end make users associations

    // make client associations
    worksection_clients.forEach( worksection_project => {
      const assoc = association.find(project => project.type === 'client'
        && project.worksection === worksection_project);

      if(!assoc){
        const client = clients.find( client => client.name.toLowerCase() === worksection_project.toLowerCase()) || {} ;
        association.push({
          worksection: worksection_project,
          postmen_id: (client && client.id) || null,
          type: 'client',
          type_of_work:  null,
          type_of_holiday: null,
        });
      }
    });
    // end make projects associations

    // add client direction to projects
    postmen_projects.map(postmen_project => {

        const client = clients.find(c => c.id === postmen_project.client);

        if(client){
            postmen_project.direction = client.direction;
        }

        return postmen_project;
    });

    return {
        association,
        postmen_users,
        postmen_projects,
    }
  }

  fillUserTime = () => {
        const { wsUsers } = this.props.worksection;
        const { postmen_users, association } = this.state;

        return wsUsers.map(user => {
            const value = association.find((item)=> item.worksection === user.email);

            return(
                <tr key={ user.name }>
                    <td>{ user.name }</td>
                    <td>{ user.email }</td>
                    <td>
                        <Select
                            options={postmen_users}
                            placeholder="Співробітник"
                            simpleValue
                            onChange={(user_id) => {
                                const association = this.state.association.slice();
                                const assocIndex = association.findIndex((assoc)=> assoc.type === 'user' && assoc.worksection === user.email)
                                association[assocIndex] = {
                                    ...association[assocIndex],
                                    postmen_id: user_id
                                }

                                this.setState({association});
                            }}
                            value={(value && value.postmen_id) || null}
                        />
                    </td>
                </tr>
            )
        });
    }

  fillClientsTable = () => {
        const { worksection_clients } = this.props.worksection;
        const { association } = this.state;

        const groupedProjects = this.props.clients.map(item => ({ ...item, label:item.name, value: item.id}));

        return worksection_clients.map(project => {
            const value = association.find((item)=> item.worksection === project && item.type === 'client');

            return(
                <tr key={ project }>
                    <td>{ project }</td>
                    <td>
                        <Select
                            options={groupedProjects}
                            placeholder="Клієнт"
                            simpleValue
                            onChange={client_id => {
                              const association = [...this.state.association];
                              const index = association.findIndex(item =>
                                item.worksection === project &&
                                item.type === 'client'
                              );
                              if (index > -1) {
                                association[index].postmen_id = client_id;
                              } else {
                                association.push({
                                  worksection: project,
                                  postmen_id: client_id,
                                  type: 'client',
                                  type_of_holiday: null,
                                  type_of_work: null,
                                })
                              }
                              this.setState({association});

                            }}
                            value={(value && value.postmen_id) || null}
                            />
                    </td>
                </tr>
            )
        });
    }

  fillProductsTable = () => {
    const { worksection_products } = this.props.worksection;
    const { products, work, holiday } = this.props.config;
    const { association } = this.state;

    const defaultProducts = [...products, ...work, ...holiday]
      .map(item => ({label: item.name, value: item.slug || item.name}));

    return worksection_products.map(({name: product}) => {
        const value = association.find(item => item.worksection === product);

      return(
        <tr key={ product }>
          <td>{ product }</td>
          <td>
            <Select
              options={defaultProducts}
              placeholder="Продукт"
              simpleValue
              onChange={value => {
                const association = [...this.state.association];
                const index = association.findIndex(item => item.worksection === product );
                const isHoliday = holiday.find(item => item.slug === value);
                const isWork = work.find(item => item.slug === value);
                const type_of_holiday = isHoliday || isWork ? value : null;
                const type_of_work = (isHoliday && 'holiday') || (isWork && 'general') || 'work';
                if (index > -1) {
                  association[index].postmen_id = value;
                  association[index].type_of_holiday = type_of_holiday;
                  association[index].type_of_work = type_of_work;
                } else {
                    value && association.push({
                    worksection: product,
                    postmen_id: value,
                    type: 'product',
                    type_of_holiday,
                    type_of_work,
                  })
                }
                this.setState({association});
              }}
              value={(value && value.postmen_id) || null}
            />
          </td>
        </tr>
      )
    });
  };

  fillTotalTableTime = () => {
        const { association, postmanUsersToShow} = this.state;
        const {clients, worksection: { users_time, worksection_clients, postmen_projects }} = this.props;
        const result = [];

        const usersWithValue = Object.values(postmanUsersToShow);

        association.filter(assoc => assoc.type === 'client'
            && assoc.postmen_id !== null
            && worksection_clients.find(worksection_project => worksection_project === assoc.worksection))
            .sort((a) => a.type_of_holiday == null ? -1 : 1)
            .forEach(assocClient => {
                const postmanClient = clients.find(({_id})=> _id === assocClient.postmen_id);
                result.push(<tr className="client-header" key={`${assocClient.worksection}`}>
                    <td>
                        {postmanClient.name}
                    </td>
                    {usersWithValue.map((v, i) => <td key={i}> - </td> )}
                </tr>);

                const row = Object.entries(users_time[assocClient.worksection])
                        .map(([product, users])=>{
                            const postmanProduct = association.find((accos)=> accos.type === 'product' && accos.worksection === product)
                            if(!postmanProduct) return null;
                            let name
                            if(postmanProduct.type_of_work !== 'work') {
                                name = postmen_projects.find(({type_of_holiday})=> type_of_holiday === postmanProduct.type_of_holiday).name
                            } else {
                                name = postmanProduct.postmen_id
                            }
                                return <tr key={`${assocClient.worksection}-${product}`}>
                                <td>
                                    {name}
                                </td>
                                {Object.entries(postmanUsersToShow).map(([email, user]) => {
                                    const userTime = users[email];
                                    const key = `${assocClient.worksection}-${product}-${email}`
                                    // if(!products[product]) return <td key={key}> - </td>;
                                    // sum += userTime && userTime.time.formated_number || 0;
                                    return (
                                        <td key={key}>
                                            {
                                                userTime && userTime.time.formated_number || '0'
                                            }
                                        </td>);
                                })}
                            </tr>
                        }
                        );

                    result.push(row)

            }
        );
        return result
    };

    monthPickerChange = ({month, year}) => {
        this.setState({selectedDate: {month, year}});
    }

    importButtonHandler = async () => {
        this.props.setLoading(true);

        let information = await importWorksectionInformation(this.state.selectedDate);
        this.props.importWorksectionInformation(information);

        this.setState({...this.makeAssociations()});

        this.props.setLoading(false);
    }

    generateTablButtonHandler = async () => {

        const { association } = this.state;
        const { worksection: { worksection_time, worksection_clients, postmen_projects, postmen_users }} = this.props


        const exist_projects = worksection_clients.filter(wp => association.find(as => as.worksection === wp && as.postmen_id !== null));

        if(!exist_projects.length){
            this.setState({empty_project_association: true});
            return null;
        }else{
            this.setState({empty_project_association: false});
        }

        let time_to_save = [];

        const totalWorksectionTime = {
            total: 0,
            willAdd: 0,
            users: {},
            clients: {}
        };

        const postmanUsersToShow = {}


        worksection_time.forEach(time => {
            const associatedUser = association.find(assoc => assoc.worksection === time.user_from.email && assoc.type === 'user');
            const associatedClient = association.find(assoc => assoc.worksection === time.project.name && assoc.type === 'client');
            const product = time.task.parent  || time.task.name;
            const associatedProduct = association.find(assoc => assoc.worksection === product && assoc.type === 'product');

            if((associatedUser !== undefined)
            && (associatedUser.postmen_id !== null)
            && (associatedClient !== undefined)
            && (associatedClient.postmen_id !== null)
            && (associatedProduct !== undefined)
            && (associatedProduct.postmen_id !== null)
            ){
                // fix save date to format 00.00.00.0000
                const timeDate = new Date(this.state.selectedDate.year, this.state.selectedDate.month -1, time.date.split('-')[2])

                // find postmen project
                let project = null;
                let createNewProjectForClient = false;
                if(associatedProduct.type_of_work === 'work'){
                    const projectExist = postmen_projects.find(({name, client}) => name === associatedProduct.postmen_id && client === associatedClient.postmen_id)
                    if(!projectExist){
                        createNewProjectForClient = true;
                        project = associatedProduct.postmen_id
                    } else {
                        project = projectExist._id
                    }
                }

                const saved_time = time_to_save.find(user =>
                    user.user === associatedUser.postmen_id
                && +user.work_date === +timeDate
                && user.project === project
                && user.type_of_holiday === associatedClient.type_of_holiday
                && user.client === associatedClient.client
                );
                const posUser = postmen_users.find(pu => pu.value === associatedUser.postmen_id);

                if(saved_time){
                    saved_time.manager_data += this.formateTime(time.time);
                }else{
                    // find postmen project (need for result table)

                    const tmp_time_object = {
                        user: associatedUser.postmen_id,
                        project,
                        type_of_time: associatedProduct.type_of_work,
                        work_date: new Date(this.state.selectedDate.year, this.state.selectedDate.month -1, time.date.split('-')[2]),
                        manager_data: this.formateTime(time.time),
                        user_data: 0,
                        type_of_holiday: associatedProduct.type_of_holiday,
                        direction: posUser.direction,
                        client: associatedClient.postmen_id,
                        imported: true,
                        createNewProjectForClient
                    }

                    time_to_save.push(tmp_time_object);
                }
                totalWorksectionTime.willAdd += this.formateTime(time.time);
                if(!postmanUsersToShow[associatedUser.worksection]){
                    postmanUsersToShow[associatedUser.worksection] = posUser;
                    postmanUsersToShow[associatedUser.worksection].totalTime = 0
                }
                postmanUsersToShow[associatedUser.worksection].totalTime += this.formateTime(time.time);

                if (!totalWorksectionTime.clients[associatedClient.worksection]) {
                    totalWorksectionTime.clients[associatedClient.worksection] = {};
                }
                totalWorksectionTime.clients[associatedClient.worksection][associatedProduct.worksection] += this.formateTime(time.time);

            }
            totalWorksectionTime.total += this.formateTime(time.time);
        });

        await saveAssociations(association);


        this.setState({
            title: 'Таблиця з імпортованим часом',
            associations_content: !this.state.associations_content,
            time_to_save,
            totalWorksectionTime,
            postmanUsersToShow
        });

    }

    saveWorksectionImport = async () => {
        const { time_to_save } = this.state;

        console.log('time_to_save', time_to_save);

        let i = 0;
        const splitedTime = time_to_save.reduce((reducer, element) => {

            if(reducer[i].length === 250){
              i++;
              reducer[i] = [];
            }

            reducer[i].push(element);
            return reducer;
        }, [[]]);
        console.log('___timeArray', splitedTime);
        // work consistently
        try {
            splitedTime.forEach(async (data) => await saveWorksectionTime(data));
        } catch (e) {
            this.props.setError(e);
        } finally {
            this.props.history.push('/users');
        }
    }

    formateTime = (time) => {
        const parsed_time = time.split(':');
        return this.toFixed(parseInt(parsed_time[0]) + parseInt(parsed_time[1]) / 60);
    }

    toFixed = (number) => {
        return +number % 1 * 10 >= 1
        ? +number.toFixed(1)
        : +number.toFixed(0)
    }

    render() {
        const { worksection_clients, worksection_products, postmen_users, wsUsers } = this.props.worksection;
        const {
            totalWorksectionTime,
            postmanUsersToShow,
            empty_project_association } = this.state;



        return (
            <section className="userList_wrap">
                <Title title={this.state.title}/>
                {this.state.associations_content ?
                <div>
                    <p className="worksection-import-p">
                        Первірте, або оберіть відповідність співробітників з Worksetion до існуючих
                    </p>

                    <div className="param_resul_list">
                        <MonthPicker setDate={this.monthPickerChange}/>
                        <button className="inp_div btn btn-primary btn-add" onClick={this.importButtonHandler}>Імпорт</button>
                    </div>

                    {(wsUsers && wsUsers.length !== 0) && (
                    <div className="table_wrap">
                        <h3>Перевірте, або оберіть відповідність співробітників з Worksetion до існуючих</h3>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Worksection</th>
                                    <th>Email</th>
                                    <th>Postmen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.fillUserTime()}
                            </tbody>
                        </table>
                    </div>)}

                    {(worksection_clients && worksection_clients.length !== 0) && (
                    <div className="table_wrap">
                        <h3>Перевірте, або оберіть відповідність клієнтів з Worksetion до існуючих</h3>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Worksection</th>
                                    <th>Postmen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.fillClientsTable()}
                            </tbody>
                        </table>
                    </div>)}

                  {(worksection_products && worksection_products.length !== 0) && (
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
                                {this.fillProductsTable()}
                            </tbody>
                        </table>
                    </div>)}

                    {empty_project_association && (
                        <span>Немає продуктiв для імпорту</span>
                    )}

                    {(worksection_clients && worksection_clients.length !== 0) && (
                        <div className="worksection-import-bttn-holder">
                            <Link to="/users" className="inp_div btn btn-primary btn-add">Відміна</Link>
                            <button className="inp_div btn btn-primary btn-add" onClick={this.generateTablButtonHandler}>Сформувати таблицю</button>
                        </div>
                    )}
                </div>
                :
                <div>
                    <div>
                        <p className="worksection-import-p">
                            Iмпортовано {totalWorksectionTime.willAdd.toFixed(2)} годин із {totalWorksectionTime.total.toFixed(2)}
                        </p>
                    </div>

                    <div id="fixed-table-container1" className="table_overflow slo-wrapper">
                        <table className="table table-bordered table-hover slo-table">
                            <thead>
                                <tr>
                                    <th> Клiент / спiвробiтник </th>
                                    {Object.values(postmanUsersToShow).map(user => (<th key={user.value}> {user.label} </th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {this.fillTotalTableTime()}
                            </tbody>
                        </table>
                    </div>

                    <div className="worksection-import-bttn-holder">
                        <Link to="/users" className="inp_div btn btn-primary btn-add">Відміна</Link>
                        <button className="inp_div btn btn-primary btn-add" onClick={this.saveWorksectionImport}>Підтвердити імпорт</button>
                    </div>
                </div>}
            </section>
        )
    }
}

export default withRouter(connect(
    state => ({
        worksection: state.user.worksection,
        users: state.user.users,
        clients: state.user.clients,
        config: state.user.config,
    }),
    dispatch => ({
        importWorksectionInformation: (data) => {
            dispatch({type: 'SET_WORKSECTION_INFORMATION', payload: data})
        },
        clearWorksectionInformation: () => {
            dispatch({type: 'CLEAR_WORKSECTION_INFORMATION'})
        }
    })
)(WorksectionImportTime))
