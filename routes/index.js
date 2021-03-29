var express = require('express');
var router = express.Router();
var underscore = require("underscore");

var { getDereferencedYAML, getInfoFromUrl } = require("../public/javascripts/index");
var PathChecker = require("../public/javascripts/PathChecker");
var HeaderChecker = require("../public/javascripts/HeaderChecker");
var BodyChecker = require("../public/javascripts/BodyChecker");

router.all('/*', async function (req, res) {
	var url = getInfoFromUrl(req);
	var api = await getDereferencedYAML(`./products/${url.product}/${url.version}.yaml`);

	// match route
	var pathData = PathChecker.getPathData(res, api, url);
	if (pathData == null) {
		return;
	}

	// check for missing requried headers
	var areHeadersValid = HeaderChecker.areAllHeadersValid(res, req.headers, api.components.parameters);
	if (!areHeadersValid) {
		return;
	}

	// check request body
	if (req.method !== 'GET') {
		var requestBody = req.body;
		var targetRequestBody = pathData
			.requestBody
			.content["application/json"]
			.schema
			.properties;
		//BodyChecker.isRequestBodyValid(res, requestBody, targetRequestBody);
	}

	const [responseCode, responseBody] = Object.entries(pathData.responses)[0];
	res.send({
		responseCode: responseCode,
		responseBody: responseBody.description
	});
});

module.exports = router;
