/** Mixin: Barefoot.client.View
 *
 */
var _ = require('underscore');

function delegateEventsOnSubviews() {
	this.delegateEvents();
	
	if(!_.isUndefined(this.subviews)) {
		_.each(this.subviews, function(subview) {
			subview.delegateEventsOnSubviews();
		});
	}
}

function undelegateEventsOnSubviews() {
	this.undelegateEvents();

	if(!_.isUndefined(this.subviews)) {
		_.each(this.subviews, function(subview) {
			subview.undelegateEventsOnSubviews();
		});
	}
}

function close() {
	this.undelegateEvents();

	if(!_.isUndefined(this.subviews)) {
		_.each(this.subviews, function(subview) {
			subview.close();
		});
	}

	this.$el.empty();
	this.unbind();
}


module.exports = {
	delegateEventsOnSubviews: delegateEventsOnSubviews
	, undelegateEventsOnSubviews: undelegateEventsOnSubviews
	, close: close
};