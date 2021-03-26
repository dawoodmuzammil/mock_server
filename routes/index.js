var express = require('express');
var router = express.Router();
var underscore = require("underscore");

var { getDereferencedYAML, getUrlPaths } = require("../public/javascripts/index");

router.all('/*', async function (req, res) {
	try {
		let api = await getDereferencedYAML('./test.yaml');
		var urlPaths = getUrlPaths(req);
		var responses = api["paths"][req.url][req.method.toLowerCase()]["responses"]; // get all possible responses for that path
		const [responseCode, responseBody] = Object.entries(responses)[0];
		const schema = responseBody.content["application/json"].schema;
		// res.send(schema);
		// fakeProperties(schema);
		// queryParameters(schema, {});
		// console.log('api===', responses)
		// faker.jsf.resolve(schema).then(mockData => res.status(200).send({ code: responseCode, body: mockData })).catch(err => res.status(500).send(err));
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;
