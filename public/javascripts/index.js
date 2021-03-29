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
			organization: paths[2],
			product: paths[3],
			api_path: `/${paths[4]}/${paths[5]}`,
			path_parameters: paths.slice(6)
		};
	},

	// gets data related to the path from yaml file
	// returns 404 Not Found when provided path does not exist in .yaml
	getPathData(res, api, url) {
		var valid_path = getValidApiPath(api, url);
		var pathData = api['paths'][valid_path][url.method]; // get all possible responses for that path

		if (pathData == null) {
			res.status(404)
				.send(`The path ${url.method.toUpperCase()} ${url.api_path} does not exist`);
		}

		return pathData;
	}
}

// searches for a valid path from the .yaml file
// search is based on the number of path parameters found in the request
// assumption: unique set of paths with respect to Count(path_parameters)
// example, will fail when both <API_path>/locations and <API_path>/branches exist
function getValidApiPath(api, url) {
	var validPath;
	Object.keys(api['paths']).forEach(function (path) {
		pathParameterCount = getPathParameterCount(path, url);

		if (pathParameterCount == url['path_parameters'].length) {
			validPath = path;
		}
	})

	return validPath;
}

function getPathParameterCount(path, url) {
	return path.match(/[/]/g).length
		-
		url['api_path'].match(/[/]/g).length;
}