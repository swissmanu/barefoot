describe('Start.Server', function() {
	var should = require('chai').should()
		, RouterMock = function(){ return { start: function(){} }}
		, appMock = {
			get: function() {}
		};

	it('should throw an error if no express.js app is passed with startOptions', function() {
		(function() {
			Barefoot.start(RouterMock, {});
		}).should.throw('Missing "app" property in "startOptions"! Please pass a valid express app instance when starting the barefoot router on the server.');
	})
	it('should throw an error if no mainJavaScriptFile object is passed with startOptions', function() {
		(function() {
			Barefoot.start(RouterMock, { app: appMock });
		}).should.throw('Missing "mainJavaScriptFile" property in "startOptions"! Please describe how browserify should serve your applications code.');
	})

	it('should call the setupMiddlewares function if passed', function(done) {
		var startOptions = {
				app: appMock
				, mainJavaScriptFile: { file: '', route: '' }
				, setupMiddlewares: function() { done(); }
			};
		Barefoot.start(RouterMock, startOptions);
	})

})