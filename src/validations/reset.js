import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateEmail(data) {
  let errors = {};

  if (Validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
