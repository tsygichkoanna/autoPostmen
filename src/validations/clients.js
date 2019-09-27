import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function validateProjectForm(data, department) {


  let errors = {};

  if (Validator.isEmpty(data)) {
    errors.name = 'Це поле обов\'язкове';
  }
  // if (Validator.isEmpty(department)) {
  //   errors.department = 'Це поле обов\'язкове';
  // }

  //
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
export function validateClientForm(data) {
  let errors = {};

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Це поле обов\'язкове';
  }
  if(data.projects.length === 0){
    errors.projects = 'Це поле обов\'язкове'
  }
  if(Validator.isEmpty(data.direction.toString())){
    errors.direction = 'Це поле обов\'язкове'
  }
  // if (data.direction === null || Validator.isEmpty(data.direction)) {
  //   errors.direction = 'Це поле обов\'язкове';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
