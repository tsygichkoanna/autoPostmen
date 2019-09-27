import React, {Component} from 'react';
import Tooltip from './Tooltip';

class TimeCellWithInput extends Component {
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

        const {
            readOnly,
            typeOfHoliday,
            typeOfTime,
            date,
            timeId,
            onChange,
            onKeyDown,
            onBlur,
            dataWork,
            dataBlur,
            dataProject,
            dataClient
            } = this.props.inputOption;

        let {inputValue} = this.props.inputOption;

            if(inputValue !== ''){
                inputValue = this.toFixed(+inputValue);
            }
            
        const {value, mvalue} = this.props;
        const input = <input
                        className={"track_time"}
                        max={20}
                        min={0}
                        step="0.5"
                        readOnly={readOnly}
                        type={"number"}
                        data-type-of-time={typeOfTime}
                        data-type-of-holiday={typeOfHoliday}
                        data-date={date}
                        data-time-id={timeId}
                        value={inputValue}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        onBlur ={onBlur}

                        data-work={dataWork}
                        data-blur={dataBlur}
                        data-project={dataProject}
                        data-client={dataClient}
                        data-client-id={dataClient}
                    />
        

        if(!value && !mvalue){
            return (
                <td className={readOnly?'read-only':''}>
                    {input}
                </td>                
            )
        } 
        return (
            <td onMouseEnter={this.cellMouseEnter} onMouseLeave={this.cellMouseLeave}  className={readOnly?'read-only':''}>
                {input}
                { (value !== mvalue  && !!value && mvalue >= 0) &&  <Tooltip showTooltip = {this.state.showTooltip}
                                                                          value = {value && this.toFixed(value)}
                                                                          mvalue = {mvalue && this.toFixed(mvalue)}
                />}
            </td>            
        )
    }
}

export default TimeCellWithInput;