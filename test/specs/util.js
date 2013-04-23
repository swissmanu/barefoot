describe('Util', function() {
	var util = requireLibFile('util');

	describe('loadMixins', function() {
		it('should load server mixins when called on server', function() {
			var serverMixins = requireLibFile('server');
			util.loadMixins('server').should.be.equal(serverMixins);
		})
		it('should load client mixins when called on client', function() {
			var clientMixins = requireLibFile('client');
			util.loadMixins('client').should.be.equal(clientMixins);
		})
	})
	
})