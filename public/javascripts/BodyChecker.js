const res = require('express/lib/response');
const underscore = require('underscore');

module.exports = class BodyChecker {
	static isRequestBodyValid(res, api, requestBody) {
		//this.#flattenJson(targetBody['application_request']);
		return;
	}

	// static #compareRequestBodyAndTargetBody(request, target) {
	// 	var equal = true;
	// 	for (i in request)
	// 		if (!target.hasOwnProperty(i))
	// 			equal = false;
	// 	return equal;
	// }

	// static #flattenJson(target) {
	// 	for (var i in target) {
	// 		if (target.hasOwnProperty('properties')) {
	// 			this.#flattenJson(target.properties);
	// 		}
	// 		console.log(i);
	// 	}
	// }
}