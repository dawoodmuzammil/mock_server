const SwaggerParser = require('swagger-parser');
const { indexOf } = require('underscore');
const parser = new SwaggerParser();
const YAML = parser.YAML;

module.exports = {
	// returns dereferenced .yaml file
	async getDereferencedYAML(path) {
		try {
			let api = await SwaggerParser.dereference(path);
			return api;
		} catch (e) {
			return e;
		}
	},

	// splits the url by '/' and extracts info
	getInfoFromUrl(req) {
		var paths = req['url'].split('/');
		return {
			host: req.get('host'),
			organization: paths[2],
			product: paths[3],
			api_path: `/${paths[4]}/${paths[5]}`,
			method: req.method.toLowerCase()
		};
	},

	// gets data related to the path from yaml file
	// returns 404 Not Found when provided path does not exist in .yaml
	getPathData(api, url, res) {
		try {
			return api['paths'][url.api_path][url.method]; // get all possible responses for that path
		} catch (error) {
			res.status(404).send(`The path ${url.api_path} does not exist`);
		}
	}
}