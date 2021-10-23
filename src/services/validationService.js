import Joi from "joi-browser";

// Joi validation for data by schema
const validate = (data, schema) => {
	const options = { abortEarly: false };
	const { error } = Joi.validate(data, schema, options);
	if (!error) return null;
	const errors = {};
	for (let item of error.details) errors[item.path[0]] = item.message;
	return errors;
};

// Joi validation for specific properties (while typing)
const validateProperty = (key, value, schema) => {
	const obj = { [key]: value };
	const propertySchema = { [key]: schema[key] };
	const { error } = Joi.validate(obj, propertySchema);
	return error ? error.details[0].message : null;
};

const validationService = {
	validate,
	validateProperty
};

export default validationService;
