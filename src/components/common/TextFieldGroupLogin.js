import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextFieldGroupLogin = ({ field, value, placeholder, icon, error, type, onChange }) => {
  return (
    <div className={classnames('form-group has-feedback', { 'has-error': error })}>
      <input
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        type={type}
        name={field}
        className="form-control"
      />
      <span className={'glyphicon form-control-feedback glyphicon-'+icon} />
    {error && <span className="help-block">{error}</span>}
    </div>  );
};

TextFieldGroupLogin.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
};

TextFieldGroupLogin.defaultProps = {
  type: 'text'
};

export default TextFieldGroupLogin;
