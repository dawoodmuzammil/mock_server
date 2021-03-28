const res = require('express/lib/response');
const underscore = require('underscore');

module.exports = class BodyChecker {
	static isRequestBodyValid(res, requestBody) {
		res.status(200).send(requestBody);
		return;
	}
}