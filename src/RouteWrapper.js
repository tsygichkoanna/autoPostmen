import React, {Component} from 'react'

import {Route} from 'react-router'

class RouteWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {properties,exact} = this.props;
        let Component = this.props.component;
        return (
            <Route exact={!exact || true} path={this.props.path} render={(match) => (
                <Component
                    {...match}
                    {...properties}
                />
            )}/>
        )
    }
}

export default RouteWrapper