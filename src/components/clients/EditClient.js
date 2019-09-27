import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getClientInfo } from '../../actions/client.action';
import ClientForm from './addClient';

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null
    }

  }
    componentDidMount(){

      //Loader (start)
        this.props.setLoading(true);

        getClientInfo(this.props.match.params.id).then((client)=>{
            this.setState({client});
        })
            .then(()=>{
                //Loader (finish)
                this.props.setLoading(false);
            });
    }

  // ..methods
    render() {
    if(!this.state.client) return null;
        return (
            <ClientForm
              title="Редагувати кліента"
              client={this.state.client}
              id={this.props.match.params.id}

              setLoading={this.props.setLoading}
              setError={this.props.setError}
              setSuccess={this.props.setSuccess}
            />
        );
    }
}
export default withRouter(connect()(EditClient));
