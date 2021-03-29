const underscore = require('underscore');

module.exports = class HeaderChecker {
	// gets data related to the path from yaml file
	// returns 404 Not Found when provided path does not exist in .yaml
	static areAllHeadersValid(res, requestHeaders, targetHeaders) {
		// from the .yaml files, get all parameters where required = true
		var requiredHeaders = underscore
			.where(targetHeaders, { required: true })
			.map(x => x.name);

		return this.#checkForMissingHeaders(res, Object.keys(requestHeaders), requiredHeaders);
	}

	// private method
	// gets the set difference between 'sent' and 'target' headers
	// returns error if any 'required' header missing
	static #checkForMissingHeaders(res, requestHeaders, requiredHeaders) {
		var missingHeaders = requiredHeaders
			.filter(x => !requestHeaders.includes(x));;

		if (missingHeaders.length > 0) {
			res.status(404).send(`Missing required header(s): [${missingHeaders.join(', ')}]`)
			return false;
		}

		return true;
	}
}