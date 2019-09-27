import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Title from '../Title'
import PopoverForm from './PopoverForm'

import { getAllUsers as getAllUsersAction, uploadFile } from '../../actions/users.action'

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'Cпівробітники',
      fileError: null,
      fileSuccess: null,
      showArchived: false,
      users: [],
      filePath: '',
      filters: {
        department: false,
        direction: false,
        position: false,
        role: false
      },
      activeFilter: null,
      searchWord: ''
    }
  }

  componentDidMount = () => {
    this.props.setLoading(true)
    this.props.getAllUsers(this.props.setLoading)

    this.setState({
      users: this.props.users.slice()
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.users.length === 0){
      this.setState({users: nextProps.users});
    }
  }

  archiveUser = (id) => {
    const users = this.state.users.slice().filter(user => {
      if(user._id === id){
        user.isDeleted = true;
      }
      return user;
    });

    this.setState({users});
  }

  deleteUser = (id) => {
    const users = this.state.users.slice().filter(user => {
      if(user._id === id){
        return false
      }
      return user;
    });

    this.setState({users});
  }

  fileOnChange = (event) => {
    let data = new FormData()
    this.props.setLoading(true)
    data.append('file', event.target.files[ 0 ])
    uploadFile(data)
      .then(() => {
        this.props.setLoading(false)
        this.setState({fileSuccess: null, fileError: null})
        this.props.setSuccess('Зарплати були оновлені успішно.')
      })
      .catch((err) => {
        this.props.setLoading(false)
        if(err.response && err.response.data.error){
          this.props.setError(err.response.data.error)
        } else {
          this.props.setError(err.message)
        }
      })
  }

  handleShowArchivedChange = (e) => {
    this.setState({showArchived: !this.state.showArchived})
  }

  tableSorting = (e) => {

    const { type } = e.target.dataset;

    if(!type) return null;
    let users = this.props.users.slice();
    let { filters } = this.state;

    switch(type){
      case 'direction':

        if(filters[type]){
          users = users.sort((a,b) => a.direction < b.direction ? -1: 1 );
        }else{
          users = users.sort((a,b) => a.direction > b.direction? -1: 1 );
        }
        break;
        
       default:
          users = users.sort((a,b) =>{
            if(a[type] && b[type]){
              if(filters[type]){
                return a[type].name > b[type].name? -1: 1;
              }else{
                return a[type].name < b[type].name? -1: 1;
              }
            }else{
              return 1;
            }
          });
        break;
    }

    filters[type] = !filters[type];

    this.setState({
      users,
      filters,
      activeFilter: type
    })
  }

  searchUserHandler = (e) => {

    const value = e.target.value.toLowerCase();

    let users = [];

    if(value) {
      users = this.props.users.filter(user =>{

        const name = user.name.toLowerCase();
        const surname = user.surname.toLowerCase();

        if(~name.indexOf(value) || ~surname.indexOf(value)){
          return true;
        }
      });

    }else{
      users = this.props.users.slice();
    }
    
    this.setState({
      searchWord: value,
      users
    });

  }

  getUsersView = (users, loader, role, directions, showArchived) => {

    return users.filter(user => {
      if(!showArchived && user.isDeleted) {
        return false;
      }
      return user;
    }).map((user, index) => {
      return <tr key={user.id} className={`group${user.group}`} >
        <td>{index + 1}</td>
        <td>
          {role === 'jadmin' && user.role.slug === 'admin'
            ? `${user.surname} ${user.name}`
            : <Link to={`/users/edit/${user.id}`}>{`${user.surname} ${user.name}`}</Link>}
  
        </td>
        <td>{( user.direction && directions[ user.direction - 1 ].name ) || '-'}</td>
        <td>{user.department && user.department.name || '-'}</td>
        <td className={classnames({
          'isDeleted': user.position && user.position.isDeleted
        })}>
          {user.position && user.position.isDeleted
            ? 'Deleted'
            : user.position && user.position.name || '-'}
        </td>
        <td>{user.role && user.role.name || '-'}</td>
        <td>
          {!user.isDeleted ?
            <PopoverForm setLoading={loader} type="archiveUser" data_id={user.id} action={this.archiveUser}/>
            :
            <PopoverForm setLoading={loader} type="delUser" data_id={user.id} action={this.deleteUser}/>
          }
        </td>
        <td>
          {user.role.slug !== 'admin'
          && <Link to={`/individual-list/${user.id}`}>ІЛ</Link>}
        </td>
      </tr>
    })
  
  }  

  render() {
    const {showArchived, title, users, filters, activeFilter} = this.state;
    const {setLoading, role, directions} = this.props;
    return (
      <section className="users_wrap">
        <Title title={title}/>
        <div className="heading-block">
          <label className="check-label">
            Показати Архівних співробітників:
              <input name="showArchived" type="checkbox" checked={showArchived} onChange={this.handleShowArchivedChange} />
              <span></span>
          </label>
            <div className="btn-holder">
              <input className="text-input" value={this.state.searchWord} onChange={this.searchUserHandler} type="text"/>
              <Link to="/users/worksection/time-import" className="inp_div btn btn-primary btn-add">Iмпорт часу з Worksection</Link>
              <button className="inp_div btn btn-primary btn-add">Імпорт ЗП
                <input className="op_none" accept=".csv" value='' type="file" onChange={this.fileOnChange}/>
              </button>
              <Link to="/users/add" className="inp_div btn btn-primary btn-add">Додати</Link>
           </div>
        </div>
        <div className="table_wrap">
          <table className="table table-bordered table-hover">
            <thead>
            <tr>
              <th>№</th>
              <th>ПІБ</th>
              <th className={classnames({'is-active': activeFilter === 'direction'})} >
                Напрям
                <span className="arrow-box" onClick={this.tableSorting} data-type="direction">
                  {filters.direction
                  ? <i className="fa fa-sort-up" data-type="direction" />
                  : <i className="fa fa-sort-down" data-type="direction" />}
                </span>
              </th>
              <th className={classnames({'is-active': activeFilter === 'department'})} >
                Відділ
                <span className="arrow-box" onClick={this.tableSorting} data-type="department">
                  {filters.department
                  ? <i className="fa fa-sort-up" data-type="department" />
                  : <i className="fa fa-sort-down" data-type="department" />}
                </span>
              </th>
              <th className={classnames({'is-active': activeFilter === 'position'})} >
                Посада
                <span className="arrow-box" onClick={this.tableSorting} data-type="position">
                  {filters.position
                  ? <i className="fa fa-sort-up" data-type="position" />
                  : <i className="fa fa-sort-down" data-type="position" />}
                </span>
              </th>
              <th className={classnames({'is-active': activeFilter === 'role'})} >
                Роль
                <span className="arrow-box" onClick={this.tableSorting} data-type="role" >
                  {filters.role
                  ? <i className="fa fa-sort-up" data-type="role" />
                  : <i className="fa fa-sort-down"  data-type="role" />}
                </span>
              </th>
              <th>Видалити</th>
            </tr>
            </thead>
            <tbody>
            {this.getUsersView(users, setLoading, role, directions, showArchived)}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.user.users,
    role: state.auth.user.role.slug,
    directions: state.user.directions,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllUsers: (loader) => dispatch(getAllUsersAction(loader))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
