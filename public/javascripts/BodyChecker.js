const res = require('express/lib/response');
const underscore = require('underscore');

module.exports = class BodyChecker {
	static isRequestBodyValid(res, requestBody, targetBody) {
		var requestMap = this.#flattenRequestJson(requestBody[Object.keys(requestBody)[0]], null, new Map());
		console.log(`Number of properties in request: ${requestMap.size}`);

		var targetMap = this.#flattenTargetJson(targetBody[Object.keys(targetBody)[0]], null, new Map());
		console.log(`Number of properties in target: ${targetMap.size}`);

		this.#compare(requestMap, targetMap);

		return;
	}

	static #flattenRequestJson(request, parent, map) {
		var children = Object.keys(request);

		children.forEach(current => {
			// current property to the map, along with its parent property
			map.set(current, parent); // child, parent

			// get children properties 
			var child = request[current];
			if (typeof child !== 'object') {
				return;
			}

			this.#flattenRequestJson(child, current, map);
		});

		if (parent == null) {
			return map;
		}
	}

	static #flattenTargetJson(target, parent, map) {
		// get properties at that level
		// these properties will be the parents of their children (of course!)
		var children = Object.keys(target.properties);
		// var children = Object.keys(target);

		children.forEach(current => {
			// add to map
			map.set(current, parent); // child, parent

			// get children properties 
			var child = target.properties[current];
			//var child = target[current];

			if (child.type !== 'object') {
				return;
			}

			this.#flattenTargetJson(child, current, map);
		});

		if (parent == null) {
			return map;
		}
	}

	static #compare(requestMap, targetMap) {
		if (requestMap.size > targetMap.size) {
			return false;
		}

		for (var [child, parent] of requestMap) {
			console.log(`Child: ${child}, Parent: ${parent}`);
		}
	}
}

// 1. target - request == 0 (missing in request are fine)
// 2. exact match