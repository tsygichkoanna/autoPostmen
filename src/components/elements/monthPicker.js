import React, {Component} from 'react';
import Picker from 'react-month-picker';
import 'react-month-picker/css/month-picker.css';

class MonthPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.date || {year: new Date().getFullYear(), month: new Date().getMonth() + 1}
    };
  }

  handleClickMonthBox =() => {
    this.refs.pickAMonth.show();
  }
  handleAMonthDismiss = (value) => {
    if(this.state.value.month !== value.month ||
      this.state.value.year !== value.year){
      this.setState({value});
      this.props.setDate(value);
    }
  }
  handleClick = (year, month) => {
    this.handleAMonthDismiss({year, month})
  }

  render() {
    const pickerLang = {
      months: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лист', 'Гру']
    };

    let makeText = date => {
      if (date && date.year && date.month)
        return (pickerLang.months[date.month - 1] + '. ' + date.year);
      return '?'
    };

    return (
      <div className="monthpicker">
        <Picker
          ref="pickAMonth"
          value={this.state.value}
          lang={pickerLang.months}
          onChange={this.handleClick}
          onDismiss={this.handleAMonthDismiss}
        >
          <input value={makeText(this.state.value)}
                 readOnly={true}
                 onClick={this.handleClickMonthBox}
                 disabled={this.props.disabled}
          />
        </Picker>
      </div>
    );
  }
}

export default MonthPicker;