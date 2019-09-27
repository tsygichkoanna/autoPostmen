import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function validateUserForm(data) {
  let errors = {};


  if (Validator.isEmpty(data.selectedOptions.l_name)) {
    errors.l_name = `Це поле є обов'язковим`;
  }
  if (Validator.isEmpty(data.selectedOptions.f_name)) {
    errors.f_name = `Це поле є обов'язковим`;
  }
  if (!data.selectedOptions.selectedDirection) {
    errors.direction = `Це поле є обов'язковим`;
  }
  if (!data.selectedOptions.selectedDepartment) {
    errors.department = `Це поле є обов'язковим`;
  }
  if (!data.selectedOptions.selectedPosition) {
    errors.position = `Це поле є обов'язковим`;
  }
  if (!data.selectedOptions.selectedRole) {
    errors.role = `Це поле є обов'язковим`;
  }
  if (Validator.isEmpty(data.selectedOptions.startDate)) {
    errors.startDate = `Це поле є обов'язковим`;
  }
  const parsedDate = new Date(data.selectedOptions.startDate);
  
  if (!parsedDate || parsedDate.getFullYear() > new Date().getFullYear() + 1) {
    errors.startDate = `Неправильна дата`;
  }
  if (Validator.isEmpty(data.selectedOptions.email)) {
    errors.email = `Це поле є обов'язковим`;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
