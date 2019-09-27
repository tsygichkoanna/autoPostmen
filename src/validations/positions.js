import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function validateJobForm(data) {
  let errors = '';

  if (Validator.isEmpty(data)) {
    errors = 'This field is required';
  }
  //
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
export function validatePositionForm(data) {
  let errors = {};

  if (Validator.isEmpty(data.positionName)) {
    errors.positionName = 'This field is required';
  }

  if (data.department === null || Validator.isEmpty(data.department)) {
    errors.department = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
