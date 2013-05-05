var BarefootServer = global.BarefootServer
	, BarefootClient = global.BarefootClient
	, Backbone = require('backbone');

describe('Barefoot', function() {
	describe('Module exports', function() {
		it('should backbones Events object as Events', function() {
			Barefoot.Events.should.be.equal(Backbone.Events);
		})
	})
	
	describe('isRunningOnServer', function() {
		it('should return true when barefoot is running on the server', function() {
			BarefootServer.isRunningOnServer().should.be.true;
		})
		
		it('should return false when barefoot is running on the server', function() {
			BarefootClient.isRunningOnServer().should.be.false;
		})
	})
})