import React, { Component } from 'react';
import Title from '../Title';
//
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Dashboard"
    };
  }
    render() {
        return (
            <div>
              <Title title={this.state.title}/>
            </div>
        );
    }
}

export default Dashboard;
