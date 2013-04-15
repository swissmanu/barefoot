/** Mixin: Barefoot.shared.View
 *
 */

var _ = require('underscore');

function addSubview(subview) {
	if(_.isUndefined(this.subviews)) {
		this.subviews = [];
	}

	subview.parentView = this;
	this.subviews.push(subview);
}

function removeSubview(subview) {
	subview.close();

	if(this.subviews) {
		this.subviews = _.without(this.subviews, subview);
	}

	subview.parentView = undefined;
}

function renderSubviews() {
	var self = this;

	_.each(self.subviews, function(subview) {
		subview.$ = self.$;
		subview.$el = self.$(subview.el);

		subview.render.call(subview);
		subview.delegateEvents();
	});
}

function render() {
	this.renderView();
	this.renderSubviews();
}

module.exports = {
	addSubview: addSubview
	, renderSubviews: renderSubviews
	, render: render
};