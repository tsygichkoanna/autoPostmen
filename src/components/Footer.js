import React, { Component } from 'react';
import '../admin-lte/plugins/iCheck/square/grey.css';

class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                {/*<!-- To the right -->*/}
                <div className="pull-right hidden-xs">

                </div>
                {/*<!-- Default to the left -->*/}
                <strong>Copyright &copy; 2016 <a href="">Postmen</a>.</strong> All rights reserved.
            </footer>
        );
    }
}

export default Footer;