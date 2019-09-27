import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Sidebar extends Component {
  render () {
    return (
      <aside className="main-sidebar">

        {/*<!-- sidebar: style can be found in sidebar.less -->*/}
        <section className="sidebar">

          {/*<!-- Sidebar Menu -->*/}
          {checkRole(this.props.auth.user, 'employee') &&
          (<ul className="sidebar-menu" data-widget="tree">
            <li><Link to='/'><i className="fa fa-address-card"/>Індивідуальний лист</Link></li>
            <li><Link to='/info'><i className="fa fa-cog"/>Мої дані </Link></li>
          </ul>)}
          {checkRole(this.props.auth.user, 'head_of_department') &&
          (<ul className="sidebar-menu" data-widget="tree">
            <li><Link to='/'><i className="fa fa-address-card"/>Індивідуальний лист</Link></li>
            <li><Link to='/slo'><i className="fa fa-list-alt"/>СЛО </Link></li>
            <li><Link to='/info'><i className="fa fa-cog"/>Мої дані </Link></li>
          </ul>)}
          {checkRole(this.props.auth.user, 'account_manager') &&
          (<ul className="sidebar-menu" data-widget="tree">
            <li><Link to='/'><i className="fa fa-address-card"/>Індивідуальний лист</Link></li>
            <li><Link to='/project-list'><i className="fa fa-file-text"/>Проектний лист</Link></li>
            <li><Link to='/info'><i className="fa fa-cog"/>Мої дані </Link></li>
          </ul>)}
          {checkRole(this.props.auth.user, 'admin') &&
          (<ul className="sidebar-menu" data-widget="tree">

            <li><Link to='/users'><i className="fa fa-users"/>Cпівробітники</Link></li>
            <li><Link to='/clients'><i className="fa fa-address-card-o"/>Клієнти </Link></li>
            <li><Link to='/slo'><i className="fa fa-list-alt"/>СЛО </Link></li>
            <li><Link to='/positions'><i className="fa fa-briefcase"/>Позиції</Link></li>
            <li><Link to='/results-page'><i className="fa fa-list-alt"/>
              Результуючі листи</Link></li>
            <li><Link to='/works'><i className="fa fa-file-text"/>Види робіт</Link></li>
            <li><Link to='/info'><i className="fa fa-cog"/>Мої дані </Link></li>
            <li><Link to='/sga'><i className="fa fa-list-alt"/>СГА </Link></li>

          </ul>)}
          {checkRole(this.props.auth.user, 'jadmin') &&
          (<ul className="sidebar-menu" data-widget="tree">
            <li><Link to='/individual-list'><i className="fa fa-address-card"/>Індивідуальний лист</Link></li>
            <li><Link to='/users'><i className="fa fa-users"/>Cпівробітники</Link></li>
            <li><Link to='/clients'><i className="fa fa-address-card-o"/>Клієнти </Link></li>
            <li><Link to='/slo'><i className="fa fa-list-alt"/>СЛО </Link></li>
            <li><Link to='/positions'><i className="fa fa-briefcase"/>Позиції</Link></li>
            <li><Link to='/works'><i className="fa fa-file-text"/>Виды работ</Link></li>
            <li><Link to='/info'><i className="fa fa-cog"/>Мої дані </Link></li>
          </ul>)}
          {/*<!-- /.sidebar-menu -->*/}
        </section>
        {/*<!-- /.sidebar -->*/}
      </aside>
    )
  }
}

function checkRole (user, role) {
  if (!user.role) return false
  if (user.role.slug === role ||
    user.role === role) {
    return true
  }
  return false
}

export default connect(
  state => ({
    auth: state.auth
  })
)(Sidebar)
