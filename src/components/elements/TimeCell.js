import React, {Component} from 'react';
import Tooltip from './Tooltip';

class TimeCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false
        };
    }

    cellMouseEnter = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }
    cellMouseLeave = () => {
        this.setState({showTooltip: false})
    }

    toFixed = (number) => {
        return +number % 1 * 10 >= 1
        ? +number.toFixed(1)
        : +number.toFixed(0)
    }

    render() {

        const {value, mvalue, readOnly} = this.props;

        if(!value && !mvalue){
            return <td className={readOnly?'read-only':''}> - </td>
        } 

        return (
                <td onMouseEnter={this.cellMouseEnter} onMouseLeave={this.cellMouseLeave}  className={readOnly?'read-only':''}>
                   { value !== mvalue && !!value && mvalue >= 0 &&  
                        <Tooltip showTooltip = {this.state.showTooltip}
                            value = {value && this.toFixed(value)} 
                            mvalue = {mvalue && this.toFixed(mvalue)}        
                    />} 

                    {(mvalue !== 0)
                        ? <span className="cerrectedTime">{mvalue && this.toFixed(mvalue)}</span>
                        : this.toFixed(value) 
                    }

                </td>
            ) 
    }
}

export default TimeCell;