var express = require('express');
var router = express.Router();
var underscore = require("underscore");

var { getDereferencedYAML, getInfoFromUrl, getPathData } = require("../public/javascripts/index");
var HeaderChecker = require("../public/javascripts/HeaderChecker");
var BodyChecker = require("../public/javascripts/BodyChecker");

router.all('/*', async function (req, res) {
	var url = getInfoFromUrl(req);

	var api = await getDereferencedYAML(`./products/${url.product}/test.yaml`);

	var pathData = getPathData(res, api, url);
	if (pathData == null) {
		return;
	}

	// check for missing requried headers
	HeaderChecker.areAllHeadersValid(res, req.headers, api.components.parameters);

	BodyChecker.isRequestBodyValid(res, pathData.requestBody.content["application/json"].schema);

	//res.send("sab theek hai");

	const [responseCode, responseBody] = Object.entries(pathData)[0];
	const schema = responseBody.content["application/json"].schema;
	// res.send(schema);
	// fakeProperties(schema);
	// queryParameters(schema, {});
	// console.log('api===', responses)
	// faker.jsf.resolve(schema).then(mockData => res.status(200).send({ code: responseCode, body: mockData })).catch(err => res.status(500).send(err));
});

module.exports = router;
