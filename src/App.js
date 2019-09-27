import React, { Component } from 'react'
import { connect } from 'react-redux'

import './admin-lte/bower_components/font-awesome/css/font-awesome.min.css';
import './admin-lte/bower_components/Ionicons/css/ionicons.min.css';
import './admin-lte/dist/css/AdminLTE.min.css';
import './lib/bootstrap.min.css';
import './admin-lte/fixed-table-master/fixed-table.css';
import './App.css';

import UserList from './components/userList/userList';
import Positions from './components/positions/Positions';
import AddPosition from './components/positions/AddPosition';
import EditPosition from './components/positions/EditPosition';
import Users from './components/users/Users';
import AddUser from './components/users/AddUser';
import EditUser from './components/users/EditUser';
import WorksectionImportTime from './components/users/WorksectionImportTime';
import Login from './components/login/Login';
import Reset from './components/reset/Reset';
import Clients from './components/clients/Clients';
import AddClient from './components/clients/addClient';
import EditClient from './components/clients/EditClient';
import DepartmentTable from './components/tables/SLO';
import ProjectList from './components/tables/projectsList';
import UserInfo from './components/users/info';
import Works from './components/works/works';
import ResultsPage from './components/tables/resultsPages';
import SGA from './components/tables/SGA'

import { getCurrentUser } from './actions/auth.action';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import { withRouter } from 'react-router-dom';
import RouteWrapper from './RouteWrapper';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      success: '',
      loading: false
    }
  }

  componentDidMount () {
    if (localStorage.jwtToken && !this.props.auth.isAuthenticated) {
      return getCurrentUser()
        .then(this.props.setCurrentUser)
        .catch((e) => {
          console.error(e.response);
          if (e.response && e.response.status === 401) {
            this.props.logout();
            localStorage.removeItem('jwtToken');
           return this.props.history.push('/login');
          }
          if (e.response && e.response.status === 401) {
            this.setLoading(false);
            this.setError('Помилка на сервері');
            return console.error(e);
          }
          this.setLoading(false);
          this.setError('Сервер не доступний');
        })
    }
    if (!localStorage.jwtToken &&
      this.props.history.location.pathname !== '/login' &&
      this.props.history.location.pathname !== '/reset-password'
    ) {
      return this.props.history.push('/login')
    }
  }

  componentWillUpdate () {
    if (!localStorage.jwtToken &&
      this.props.history.location.pathname !== '/login' &&
      this.props.history.location.pathname !== '/reset-password'
    ) {
      this.props.history.push('/login')
    }
  }

  setError = (error) => {
    this.setState({error},
      ()=>{
        setTimeout(()=>{
          this.setState({error: null});
        },10000)
      })
  }
  setLoading = (loading) => {
    if(loading !== this.state.loading) {
        this.setState({loading})
    }
  }
  setSuccess = (success) => {
    window.scrollTo(0, 0);
    this.setState({success}, ()=>{
      setTimeout(()=>{
        this.setState({success: null})
      }, 2000)
    })
  }

  render () {
    const properties = {
      setLoading: this.setLoading,
      setError: this.setError,
      setSuccess: this.setSuccess,
    };
    return (
      <div className="wrapper">
        {this.state.loading && <div className="loading-main"><i className="fa fa-spinner fa-spin fa-2x loading" /></div>}
        <Header/>
        {/*<!-- Left side column. contains the logo and sidebar -->*/
        }
        <Sidebar/>
        {/*<!-- Content Wrapper. Contains page content -->*/
        }
        <div className="content-wrapper">
          {this.state.error && <div className="alert alert-danger">{this.state.error.toString()}</div>}

          {this.state.success && <div className="alert alert-success">
            {this.state.success}
          </div>}

          {/*<!-- Main content -->*/}
          <section className="content container-fluid">
            <RouteWrapper path="/login" component={Login} properties={properties}/>
            <RouteWrapper path="/reset-password" component={Reset} properties={properties} />
            <RouteWrapper exact path="/info" component={UserInfo} properties={properties}/>
            {checkRole(this.props.auth.user, 'employee')
            && (
              <div className="content">
                <RouteWrapper exact path="/" component={UserList} properties={properties}/>
              </div>
            )
            }
            {checkRole(this.props.auth.user, 'head_of_department')
            && (
              <div className="content">
                <RouteWrapper exact path="/" component={UserList} properties={properties}/>
                <RouteWrapper exact path="/individual-list" component={UserList} properties={properties}/>
                <RouteWrapper path="/slo" component={DepartmentTable} properties={properties}/>
                <RouteWrapper path="/individual-list/:id" component={UserList} properties={properties}/>
              </div>
            )
            }
            {checkRole(this.props.auth.user, 'account_manager')
            && (
              <div className="content">
                <RouteWrapper exact path="/" component={UserList} properties={properties}/>
                <RouteWrapper exact path="/individual-list" component={UserList} properties={properties}/>
                <RouteWrapper path="/project-list" component={ProjectList} properties={properties}/>
              </div>
            )
            }
            {checkRole(this.props.auth.user, 'admin')
            && (
              <div className="content">
                <RouteWrapper exact path="/" component={Users} properties={properties}/>
                <RouteWrapper path="/individual-list/:id" component={UserList} properties={properties}/>
                <RouteWrapper exact path="/positions" component={Positions} properties={properties}/>
                <RouteWrapper path="/positions/add" component={AddPosition} properties={properties}/>
                <RouteWrapper path="/positions/edit/:id" component={EditPosition} properties={properties}/>

                <RouteWrapper path="/slo" component={DepartmentTable} properties={properties}/>

                <RouteWrapper exact path="/users" component={Users} properties={properties}/>
                <RouteWrapper path="/users/add" component={AddUser} properties={properties}/>
                <RouteWrapper path="/users/edit/:id" component={EditUser} properties={properties}/>
                <RouteWrapper path="/users/worksection/time-import" component={WorksectionImportTime} properties={properties}/>

                <RouteWrapper exact={true} path="/clients" component={Clients} properties={properties}/>
                <RouteWrapper path="/clients/add" component={AddClient} properties={properties}/>
                <RouteWrapper path="/clients/edit/:id" component={EditClient} properties={properties}/>
                <RouteWrapper exact path="/works" component={Works} properties={properties}/>
                <RouteWrapper path="/results-page" component={ResultsPage} properties={properties}/>
                <RouteWrapper path="/sga" component={SGA} properties={properties}/>
              </div>
            )
            }
            {checkRole(this.props.auth.user, 'jadmin')
            && (
              <div className="content">
                <RouteWrapper exact path="/individual-list" component={UserList} properties={properties}/>
                <RouteWrapper exact path="/" component={Users} properties={properties}/>
                <RouteWrapper path="/individual-list/:id" component={UserList} properties={properties}/>
                <RouteWrapper exact path="/positions" component={Positions} properties={properties}/>
                <RouteWrapper path="/positions/add" component={AddPosition} properties={properties}/>
                <RouteWrapper path="/positions/edit/:id" component={EditPosition} properties={properties}/>

                <RouteWrapper path="/slo" component={DepartmentTable} properties={properties}/>

                <RouteWrapper exact path="/users" component={Users} properties={properties}/>
                <RouteWrapper path="/users/add" component={AddUser} properties={properties}/>
                <RouteWrapper path="/users/edit/:id" component={EditUser} properties={properties}/>
                <RouteWrapper path="/users/worksection/time-import" component={WorksectionImportTime} properties={properties}/>
                <RouteWrapper path="/users/worksection/time-table" component={WorksectionImportTime} properties={properties}/>

                <RouteWrapper exact={true} path="/clients" component={Clients} properties={properties}/>
                <RouteWrapper path="/clients/add" component={AddClient} properties={properties}/>
                <RouteWrapper path="/clients/edit/:id" component={EditClient} properties={properties}/>
                <RouteWrapper exact path="/works" component={Works} properties={properties}/>
              </div>
            )
            }
          </section>
          {/*<!-- /.content -->*/}
        </div>
        {/*<!-- /.content-wrapper -->*/
        }
        {/*<!-- Main Footer -->*/
        }
        <Footer/>
        {/*<!-- Control Sidebar -->*/}
        <div className="control-sidebar-bg"/>
      </div>
    )
  }
}

function checkRole (user, role) {
  if (!user.role) return false
  return user.role.slug === role
    || user.role === role
}

export default withRouter(connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    setCurrentUser: (action) => {
      dispatch(action)
    },
    logout: () => {
      dispatch({type: 'LOGOUT'})
    }
  })
)(App))