import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getPositionInfo } from '../../actions/positions.action'
import AddPosition from './AddPosition'

class EditPosition extends Component {
  constructor (props) {
    super(props);

    this.state = {
      data: null,
    }
  }

  componentDidMount(){
      this.props.setLoading(true);

      getPositionInfo(this.props.match.params.id)
          .then((data) => {
              this.setState({data});
              this.props.setLoading(false)
          })
        .catch(()=>{
          this.props.setLoading(false)
        })
  }

  render () {
    if (!this.state.data) return null;
    return (
      <AddPosition
        title="Редагувати позицію"
        id={this.props.match.params.id}
        {...this.state.data}
        setLoading={this.props.setLoading}
        setError={this.props.setError}
        setSuccess={this.props.setSuccess}
      />
    )
  }
}

export default withRouter(connect(
  state => ({}))(EditPosition))
