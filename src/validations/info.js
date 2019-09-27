import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function validateInfoForm(data) {
  let errors = {};


  if (Validator.isEmpty(data.name)) {
    errors.name = 'Поле обов\'язкове';
  }
  if (Validator.isEmpty(data.surname)) {
    errors.surname = 'Поле обов\'язкове';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Поле обов\'язкове';
  }

  if(data.password){
    if(data.password.length < 8){
      errors.password = 'Пароль повинен складатися мінімум з 8 символів';
    } else
    if(data.password !== data.secondPassword){
      errors.secondPassword = 'Паролі не співпадають';
    }
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Поле обов\'язкове';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
