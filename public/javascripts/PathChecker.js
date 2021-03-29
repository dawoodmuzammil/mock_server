module.exports = class PathChecker {
	// gets data related to the path from yaml file
	// returns 404 Not Found when provided path does not exist in .yaml
	static getPathData(res, api, url) {
		var valid_path = PathChecker.#getValidApiPath(api, url);
		var pathData = api['paths'][valid_path][url.method]; // get all possible responses for that path

		if (pathData == null) {
			res.status(404)
				.send(`The path ${url.method.toUpperCase()} ${url.api_path} does not exist`);
		}

		return pathData;
	}

	// searches for a valid path from the .yaml file
	// search is based on the number of path parameters found in the request
	// assumption: unique set of paths with respect to Count(path_parameters)
	// example, will fail when both <API_path>/locations and <API_path>/branches exist
	static #getValidApiPath(api, url) {
		var validPath;
		Object.keys(api['paths']).forEach(function (path) {
			var pathParameterCount = PathChecker.#getPathParameterCount(path, url);

			if (pathParameterCount == url['path_parameters'].length) {
				validPath = path;
			}
		})

		return validPath;
	}

	// following the generic request mock/<version>/<organization>/<product>/<API_path>/...
	// we can get the number of path parameters
	static #getPathParameterCount(path, url) {
		return path.match(/[/]/g).length
			-
			url['api_path'].match(/[/]/g).length;
	}
}