const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validatePostInput = (data) => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  if (!Validator.isLength(data.text, { min: 6, max: 300 })) {
    errors.text = "Post must be between 6 and 300 characters.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
