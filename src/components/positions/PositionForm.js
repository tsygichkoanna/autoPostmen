import React from 'react'
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';

import Title from '../Title';
import TextFieldGroup from '../common/TextFieldGroup';
import Select from 'react-select';
import PopoverForm from './PopoverForm';

class PositionForm extends React.Component {
  render() {

    const {errors, resError, positionName, department, departments} = this.props;
    return (
      <section className="addPositions_wrap">
        <Title title={this.props.title}/>
        <div className="form_wrap">
          <form onSubmit={this.props.HandleOnSubmit}>

            {resError && <div className="alert alert-danger">{resError}</div>}

            <TextFieldGroup
              field="positionName"
              label="Назва"
              value={positionName}
              error={errors.positionName}
              onChange={this.props.HandleOnChange}

            />
            <div className="form-group">
              <label>Відділ</label>
              <Select
                name="direction"
                onChange={this.props.handleSelectChange}
                options={departments}
                placeholder="Напрям"
                simpleValue
                value={department}
              />
              {errors.direction && <span className="help-block">{errors.direction}</span>}
            </div>
            <div className="btn_wrap">
              <Link to="/positions" className="btn btn-discard">Відмінити</Link>
              <button type="submit" className="btn btn-primary">Зберегти</button>
            </div>
          </form>
        </div>
      </section>
    )
  }
}

export default withRouter(connect(
  null,
  null)(PositionForm));
