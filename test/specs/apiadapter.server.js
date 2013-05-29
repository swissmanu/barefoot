describe('APIAdapter.Server', function() {

	describe('dispatchLocalApiCall', function() {
		var apiAdapter
			, app
			, req
			, getRoute = '/testGet'
			, postRoute = '/testPost';

		before(function() {
			app = require('../mocks/expressjs/app');
			req = require('../mocks/expressjs/req');

			apiAdapter = new Barefoot.APIAdapter({
				app: app
			});
			apiAdapter.req = req;
		})

		it('should have del as an alias for delete', function() {
			apiAdapter.del.should.be.equal(apiAdapter['delete']);
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

		it('should execute a single callback', function(done) {
			apiAdapter.get(getRoute, function(success) { success(); });
			apiAdapter.dispatchLocalApiCall('get', getRoute, {}, {
				success: done
			});
		})

		it('should execute all callbacks if more than one is stacked upon a route', function(done) {
			var callbacks = [
				function callback1(success) { success(); }
				, function callback2(success) { success(); }
				, function callback3(success) { success(); }
			];

			apiAdapter.get(getRoute, callbacks);
			apiAdapter.dispatchLocalApiCall('get', getRoute, {}, {
				success: done
			});
		})

		it('should stop execution of stacked callbacks as soon as error callback is called', function(done) {
			var callbacks = [
				function callback1(success) { success(); }
				, function callback2(success) { error(); }
			];

			apiAdapter.get(getRoute, callbacks);
			apiAdapter.dispatchLocalApiCall('get', getRoute, {}, {
				success: function() {}
				, error: function() { done(); }
			});
		})
	})

})