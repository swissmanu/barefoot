describe('APIAdapter.Server', function() {

	describe('dispatchLocalApiCall', function() {
		var apiAdapter
			, app
			, getRoute = '/testGet'
			, postRoute = '/testPost';

		before(function() {
			app = require('../fixtures/expressJsMock');

			apiAdapter = new Barefoot.APIAdapter({
				app: app
			});
		})

		it('should not fail if the options argument is omited', function() {
			apiAdapter.get(getRoute, function(success) { success(); });

			(function() {
				apiAdapter.dispatchLocalApiCall('get', getRoute);
			}).should.not.throw();
		})

		it('should not fail if options does not specify a success or error callback', function() {
			apiAdapter.get(getRoute, function(success) { success(); });

			(function() {
				apiAdapter.dispatchLocalApiCall('get', getRoute, {});
			}).should.not.throw();
		})

		it('should forward the passed success callback to the API handler', function(done) {
			apiAdapter.get(getRoute, function(success) { success(); });
			apiAdapter.dispatchLocalApiCall('get', getRoute, {}, {
				success: done
			});
		})

		it('should forward the passed error callback to the API handler', function(done) {
			apiAdapter.get(getRoute, function(success, error) { error(); });
			apiAdapter.dispatchLocalApiCall('get', getRoute, {}, {
				error: done
			});
		})

		it('should pass the given data to the API handler', function(done) {
			var expectedData = {
					name: 'foo'
					, address: 'bar'
				}
				, handler = function(success, error, data) {
					if(data === expectedData) {
						done();
					}
				};

			apiAdapter.post(postRoute, handler);
			apiAdapter.dispatchLocalApiCall('post', postRoute, expectedData);
		})		
	})
	
})