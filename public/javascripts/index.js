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
			res.send(e);
		}
	},

	// splits the url by '/' and extracts info
	getUrlPaths(req) {
		var paths = req['url'].split('/');
		return {
			host: req.get('host'),
			organization: paths[2],
			product: paths[3],
			api_path: `/${paths[4]}/${paths[5]}`,
		};
	}
}