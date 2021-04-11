const res = require('express/lib/response');
const underscore = require('underscore');
const diff = require('diff-arrays-of-objects');

module.exports = class BodyChecker {
	static isRequestBodyValid(res, requestBody, targetBody) {
		var requestArr = this.#flattenRequestJson(requestBody[Object.keys(requestBody)[0]], null, new Array());
		// console.log(`Number of properties in request: ${requestArr.length}`);

		var targetArr = this.#flattenTargetJson(targetBody[Object.keys(targetBody)[0]], null, Array());
		// console.log(`Number of properties in target: ${targetArr.length}`);

		return this.#isValid(requestArr, targetArr);
	}

	static #flattenRequestJson(request, parent, arr) {
		var children = Object.keys(request);

		children.forEach(current => {
			// bug: don't know why '0' comes back!
			if (parent === '0' || current === '0') {
				return;
			}

			// current property to the array, along with its parent property			
			arr.push({
				parent: parent,
				child: current
			});

			// get children properties 
			var child = request[current];
			if (typeof child !== 'object') {
				return;
			}

			// if an array, pass the first element to fetch properties
			if (Array.isArray(child) && child.length > 0) {
				this.#flattenRequestJson(child[0], current, arr);
			}

			this.#flattenRequestJson(child, current, arr);
		});

		if (parent == null) {
			return arr;
		}
	}

	static #flattenTargetJson(target, parent, arr) {
		// get properties at that level
		// these properties will be the parents of their children (of course!)
		// if mno properties found, initialize empty array
		var children = Object.keys(target.properties ?? []);

		children.forEach(current => {
			// add to array
			arr.push({
				parent: parent,
				child: current
			});

			// get children properties 
			var child = target.properties[current];

			if (child.type !== 'object' && child.type !== 'array') {
				return;
			}

			// in case child is of type array
			if (child.type === 'array') {
				this.#flattenTargetJson(child.items, current, arr);
			}
			else {
				this.#flattenTargetJson(child, current, arr);
			}
		});

		if (parent == null) {
			return arr;
		}
	}

	static #isValid(requestArr, targetArr) {
		if (requestArr.length > targetArr.length) {
			return false;
		}

		var invalidRequestFields = [];

		for (var i = 0; i < requestArr.length; i++) {
			var rParent = requestArr[i].parent;
			var rChild = requestArr[i].child;
			var matchFound = false;

			for (var j = 0; j < targetArr.length; j++) {
				var tParent = targetArr[j].parent;
				var tChild = targetArr[j].child;

				// check if matching
				if (tParent === rParent && tChild === rChild) {
					matchFound = true;
					break;
				}
			}

			// no match found for request property in targetBody
			if (!matchFound) {
				invalidRequestFields.push(requestArr[i]);
			}
		}

		// if at least one invalid property exists in request
		if (underscore.any(invalidRequestFields)) {
			console.log(JSON.stringify(invalidRequestFields, null, 4));
			return false;
		}

		return true;
	}
}