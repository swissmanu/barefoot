var httpMethods = require('methods')
	, _ = require('underscore')
	, mock = {};

_.each(httpMethods, function(httpMethod) {
	mock[httpMethod] = function() { };
});

module.exports = mock;