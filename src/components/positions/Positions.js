import React, { Component } from 'react';

import Title from '../Title';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllPositions as getAllPositionsAction } from '../../actions/positions.action';
import PopoverForm from './PopoverForm';

class Positions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Позиції"
    };
  }

  componentDidMount(){

      //Loader (start)
      this.props.setLoading(true);
      this.props.getAllPositions(this.props.setLoading);
  }

  renderPositionsView(positions) {
    
      return positions.map((position, index)=>{
          return <tr key={position.id}>
              <td>{index + 1}</td>
              <td><Link to={`/positions/edit/${position.id}`}>{`${position.name} `}</Link></td>
              <td>
                  <PopoverForm type='delPos' data_id={position.id} setLoading = {this.props.setLoading}/>
              </td>
          </tr>
      });
    }


    render() {

        return (
          <section className="positions_wrap">
            <Title title={this.state.title}/>
            <Link to='/positions/add' className="btn btn-primary btn-add">Додати позицію</Link>
            <div className="table_overflow">
              <table className="table table-bordered table-hover">
                  <thead>
                      <tr>
                        <th>№</th>
                        <th>Назва</th>
                        <th>Видалити</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.renderPositionsView(this.props.positions)}
                  </tbody>
              </table>
            </div>
          </section>
        );
    }
}

const mapPropsToProps = state => {
  return {
      positions: state.position.positions
  }
};
const mapDispatchToProps = dispatch => {
    return {
        getAllPositions : loader => dispatch(getAllPositionsAction(loader))
    }
};

export default connect(mapPropsToProps,mapDispatchToProps)(Positions);
