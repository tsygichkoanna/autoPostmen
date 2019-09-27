import React, { Component } from 'react';

import Title from '../Title';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllClients } from '../../actions/client.action';
import PopoverForm from './PopoverForm';

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Клієнти",

        };
    }

    componentDidMount(){
        //Loader (start)
        this.props.setLoading(true);

        this.props.getAllClients(this.props.setLoading);
    }

    getClientsView(clients) {
        return clients.map((client, index)=>{
            return <tr key={client.id}>
                <td>{index + 1}</td>
                <td><Link to={`/clients/edit/${client.id}`}>{client.name}</Link></td>
                <td>{client.projects_count}</td>
                <td>
                    <PopoverForm
                        type="delClient"
                        data_name={client.name}
                        data_id={client.id}

                        setLoading={this.props.setLoading}
                    />
                </td>
            </tr>
        });

    }

    render() {
        return (
            <section className="users_wrap">
                <Title title={this.state.title}/>
                <Link to='/clients/add' className="btn btn-primary btn-add">Додати</Link>
                <div className="table_wrap">
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Назва</th>
                            <th>Кількість продуктів</th>
                            <th>Видалити</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getClientsView(this.props.clients)}
                        </tbody>
                    </table>
                </div>

            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        clients: state.client.clients
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getAllClients: loader => dispatch(getAllClients(loader))
    }
};
//
export default connect(mapStateToProps,mapDispatchToProps)(Clients);
