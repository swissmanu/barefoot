describe('View.Client', function() {
	var view;

	beforeEach(function() {
		view = new BarefootClient.View({ el: 'body' });
		view.$el = { empty: function() {} };
	})

	describe('delegateEventsOnSubviews', function() {
		it('should call delegateEvents on itself', function(done) {	
			view.delegateEvents = done;
			view.delegateEventsOnSubviews();
		})

		it('should call delegateEventsOnSubviews on subviews', function(done) {
			var subview = new BarefootClient.View({ el: 'nav' });
			view.addSubview(subview);
			subview.delegateEventsOnSubviews = done;

			view.delegateEventsOnSubviews();
		})
	})

	describe('close', function() {
		it('should call undelegateEvents on itself', function(done) {
			view.undelegateEvents = done;
			view.close();
		})

		it('should call close an subviews', function(done) {
			var subview = new BarefootClient.View({ el: 'nav' });
			subview.close = done;
			view.addSubview(subview);

			view.close();
		})

		it('should empty the DOM element', function(done) {
			view.$el.empty = done;
			view.close();
		})

		it('should call unbind on itself', function(done) {
			view.unbind = done;
			view.close();
		})
	})
})