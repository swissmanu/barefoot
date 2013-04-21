describe('Errors', function() {
	describe('createError', function() {
		it('should create an error object with the given http status code', function() {
			var statusCode = 99999
				, errorName = 'My Fancy Error'
				, FancyError = Barefoot.errors.createError(statusCode, errorName)
				, testError = new FancyError();

			testError.httpStatusCode.should.be.equal(statusCode);
		})
		it('should create an error object with the given name', function() {
			var statusCode = 99999
				, errorName = 'My Fancy Error'
				, FancyError = Barefoot.errors.createError(statusCode, errorName)
				, testError = new FancyError();

			testError.name.should.be.equal(errorName);
		})
	})

	describe('NotFoundError', function() {
		it('should take a message', function() {
			var message = 'My fancy message'
				, notFoundError = new Barefoot.errors.NotFoundError(message);

			notFoundError.message.should.be.equal(message);
		})
		it('should have "Not found" as name', function() {
			var notFoundError = new Barefoot.errors.NotFoundError()
				, name = 'Not Found';

			notFoundError.name.should.be.equal(name);
		})
		it('should represent an HTTP Not Found (404) error', function() {
			var notFoundError = new Barefoot.errors.NotFoundError()
				, httpNotFoundCode = 404;

			notFoundError.httpStatusCode.should.be.equal(httpNotFoundCode);
		})
	})
})