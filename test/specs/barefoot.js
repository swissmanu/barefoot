var BarefootServer = global.BarefootServer
	, BarefootClient = global.BarefootClient;

describe('Barefoot', function() {
	describe('isRunningOnServer', function() {
		it('should return true when barefoot is running on the server', function() {
			BarefootServer.isRunningOnServer().should.be.true;
		})
		
		it('should return false when barefoot is running on the server', function() {
			BarefootClient.isRunningOnServer().should.be.false;
		})
	})
})