import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Це поле є обов`язковим';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Введіть коректний Email';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Це поле є обов`язковим';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
