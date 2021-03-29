# Node.js Based Mock-Server

A mock server using Swagger-Parser package

## Notes

* Folder structrure: 
	products
		| - <product_name>
		|	| - v1.yaml
		|	| - v2.yaml

* The YAML files must be renamed to indicate their version e.g. "v1.yaml"

* For route matching, it is assumed that there consists only a single path with x numebr of path parameters

* During header checking, only absense of required headers is checked. Additional headers does not cause any error