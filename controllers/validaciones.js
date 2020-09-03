const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateLoginInput(data) {
  let error = {};
  // Convierto valores vacíos en strings para poder usar el Validatos
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Controlo email
  if (Validator.isEmpty(data.email)) {
    error.message = "The email is required";
  } else if (!Validator.isEmail(data.email)) {
    error.message = "The email is not valid";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    error.message = "The password is required";
  }
  return {
    error,
    isValid: isEmpty(error)
  };
};

module.exports = function validateRegisterInput(data) {
  let errors = {
    message: ""
  };
  // Convierto valores vacíos en strings para poder usar el Validator
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  // Controlo email
  if (Validator.isEmpty(data.email)) {
    errors.message = (errors.message ? errors.message : "") + "The email is required ";
  } else if (!Validator.isEmail(data.email)) {
    errors.message = (errors.message ? errors.message : "") + "The email is not valid ";
  }
  // Controlo password
  if (Validator.isEmpty(data.password)) {
    errors.message = (errors.message ? errors.message : "") + "The password is required ";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.message = (errors.message ? errors.message : "") + "Please confirm the password ";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = (errors.message ? errors.message : "") + "Max length 30 ";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.message = (errors.message ? errors.message : "") + "The confirmation of the password must match ";
  }
  return {
    errors,
    isValid: isEmpty(errors.message)
  }
}