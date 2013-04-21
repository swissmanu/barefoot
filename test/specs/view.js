describe('View', function() {
	var Barefoot = requireModule('./index')
		, should = require('chai').should();

	describe('Mixin Functionality', function() {
		it('should apply a mixin to its prototype', function() {
			var mixin = { mix: function() { } }
				, View = requireModule('./view')
				, withMixin = View(mixin);

			withMixin.prototype.should.have.property('mix', mixin.mix);
		})
	})

	describe('addSubview', function() {
		var view;

		beforeEach(function() {
			view = new Barefoot.View({ el: 'body' });
		})

		it('should add a subview', function() {
			var subview = new Barefoot.View({ el: 'nav' });
			view.addSubview(subview);

			view.subviews[0].should.be.equal(subview);
		})

		it('should set the parent view of subview when adding the subview', function() {
			var subview = new Barefoot.View({ el: 'nav' });
			view.addSubview(subview);

			subview.parentView.should.be.equal(view);
		})
	})

	describe('removeSubview', function() {
		var view
			, subview;

		beforeEach(function() {
			view = new Barefoot.View({ el: 'body' });
			subview = new Barefoot.View({ el: 'nav' });
			view.addSubview(subview);
		})

		it('should remove a subview', function() {
			view.removeSubview(subview);
			view.subviews.should.have.length(0);
		})

		it('should reset the parent view of subview when removing the subview', function() {
			view.removeSubview(subview);
			should.not.exist(subview.parentView);
		})

		it('should call close on the subview on removal', function(done) {
			subview.close = done;
			view.removeSubview(subview);
		})
	})

})