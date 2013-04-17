describe('View', function() {
	describe('Mixin Functionality', function() {
		it('should apply a mixin', function() {
			var mixin = { mix: function() { } }
				, View = requireModule('./view')
				, withMixin = View(mixin);

			withMixin.prototype.mix.should.be.equal(mixin.mix);
		});
	})
})