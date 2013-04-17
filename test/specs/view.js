describe('View', function() {
	describe('Mixin Functionality', function() {
		it('should apply a mixin to its prototype', function() {
			var mixin = { mix: function() { } }
				, View = requireModule('./view')
				, withMixin = View(mixin);

			withMixin.prototype.should.have.property('mix', mixin.mix);
		});
	})
})