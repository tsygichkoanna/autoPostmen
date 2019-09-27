import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class CheckboxFieldGroup extends React.Component {
  render(){
    let { field, label, error, type, checked} = this.props;
    return (
      <div className={classnames(' checkbox_wrap', { 'has-error': error })}>
        <label className="">{label}
          <input
            onChange={this.props.onChange}
            type={type}
            name={field}
            checked={checked}
          />
        </label>
        {error && <span className="help-block">{error}</span>}
      </div>  );
  }
}

CheckboxFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

CheckboxFieldGroup.defaultProps = {
  type: 'checkbox',
  checked: false
}

export default CheckboxFieldGroup;
