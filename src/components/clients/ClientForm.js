import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';

import Title from '../Title';
import TextFieldGroup from '../common/TextFieldGroup';

import Select from 'react-select';

class ClientForm extends React.Component {

  renderProjectView(projectList) {
    return projectList.map((project, i) => (
       <tr key={i}>
        <td>{project.name || '-'}</td>
        <td>
          <input type="checkbox" name={project._id} checked={this.props.checkActiveProduct(project)}
                 onChange={e => this.props.handleChangeActiveProduct(e,project)}/>
        </td>
      </tr>
    ));
  }

  render() {

    const {errors, resError, name, direction, directionOptions} = this.props;
    return (
      <section className="addPositions_wrap">
        <Title title={this.props.title}/>
        <div className="form_wrap">
          <form onSubmit={this.props.HandleOnSubmit}>

            {resError && <div className="alert alert-danger">{resError}</div>}

            <TextFieldGroup
              field="name"
              label="Ім’я"
              value={name}
              error={errors.name}
              onChange={this.props.HandleOnChange}
            />
            <div className={`form-group ${errors.direction ? 'has-error' : ''}`}>
              <label>Напрям</label>
              <Select
                name="direction"
                onChange={this.props.handleSelectChange}
                options={directionOptions}
                placeholder="Напрям"
                simpleValue
                value={direction}
              />
              {errors.direction && <span className="help-block">{errors.direction}</span>}
            </div>

            <div className="table_overflow">
              <label>Продукти</label>
              <table className="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>Назва</th>
                  {/*<th>Відділ</th>*/}
                  <th>Активні</th>
                </tr>
                </thead>
                <tbody>
                {this.renderProjectView(this.props.defaultsProjects)}
                </tbody>
              </table>
            </div>
            {errors.projects && <span className="help-block">{errors.projects}</span>}
            <div className="btn_wrap">
              <Link to='/clients' id="discard" type="submit" className="btn btn-discard">Відмінити</Link>
              <button type="submit" className="btn btn-primary">Зберегти</button>
            </div>
          </form>
        </div>
      </section>
    )
  }
}

export default withRouter(connect(
  state => ({
    projects: state.client.projects,
    departmens_directions: state.client.departmens_directions
  }),
  null)(ClientForm));
