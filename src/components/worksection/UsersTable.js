import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Select from 'react-select';

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  fillUserTime = () => {
        const { time, postmen_users, association } = this.props;

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

    render() {
        const { time } = this.props.worksection;

        return time && time.length !== 0
        ? <div className="table_wrap">
                <h3>Перевірте, або оберіть відповідність співробітників з Worksetion до існуючих</h3>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Worksection</th>
                            <th>Email</th>
                            <th>Час</th>
                            <th>Postmen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.fillUserTime()}
                    </tbody>
                </table>
            </div>)}
        :null
    }
}

export default withRouter(connect(
    state => ({
    }),
    dispatch => ({
    })
)(UserTable))
