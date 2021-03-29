const SwaggerParser = require('swagger-parser');
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
			url: req['url'],
			host: req.get('host'),
			method: req.method.toLowerCase(),

			// standard api endpoint rules
			version: paths[2],
			organization: paths[3],
			product: paths[4],
			api_path: `/${paths[5]}/${paths[6]}`,
			path_parameters: paths.slice(7)
		};
	}
}

