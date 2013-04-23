describe('Util', function() {
	var util = requireLibFile('util');

	describe('getEnvironment', function() {
		it('should return "server" when executed on the server', function() {
			util.getEnvironment().should.be.equal('server');
		})
		it('should return "client" when executed on the client', function() {
			process.browser = 'Client, yay!';
			util.getEnvironment().should.be.equal('client');
		})

		after(function() {
			delete process.browser;
		})
	})

	describe('loadMixins', function() {
		it('should return server mixins when called with "server" as parameter', function() {
			var serverMixins = requireLibFile('server');
			util.loadMixins('server').should.be.equal(serverMixins);
		})
		it('should return server mixins when called with "client" as parameter', function() {
			var clientMixins = requireLibFile('client');
			util.loadMixins('client').should.be.equal(clientMixins);
		})
		it('should return server mixins when called with an unknown environment parameter', function() {
			var serverMixins = requireLibFile('server');
			util.loadMixins('foo').should.be.equal(serverMixins);
		})

		it('should return server mixins when called on server', function() {
			var serverMixins = requireLibFile('server');
			util.loadMixins().should.be.equal(serverMixins);
		})
		it('should return client mixins when called on client', function() {
			var clientMixins = requireLibFile('client');
			process.browser = 'Yay, client';
			util.loadMixins().should.be.equal(clientMixins);
			delete process.browser;
		})
	})
	
})