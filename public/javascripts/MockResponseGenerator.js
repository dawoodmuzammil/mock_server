module.exports = class MockResponseGenerator {
	static generateResponse(pathData, statusCode) {
		return pathData
			.responses[statusCode]
			.content["application/json"]
			.schema
			.example;
	}
}