/** Mixin: Barefoot.View.Shared
 * This mixin contains shared code fragments which are valid for the client as
 * also the server part of barefoot.
 * It extends the plain Backbone.View with the ability to add subviews in 
 * generic manner. Further new render methods for rendering the current view and
 * its subview are introduced.
 *
 * Attention:
 * Please be aware you are not overwriting the renderSubview and render method.
 * This would break barefoots rendering mechanisms on the server and client.
 *
 * See also:
 *     - Barefoot.View
 */
var _ = require('underscore');

/** Function: addSubview
 * Adds a Barefoot.View as subview of this view. Sets the parentView property
 * of the subview to this view.
 *
 * Parameters:
 *     (Barefoot.View) subview
 */
function addSubview(subview) {
	if(_.isUndefined(this.subviews)) {
		this.subviews = [];
	}

	subview.parentView = this;
	this.subviews.push(subview);
}

/** Function: removeSubview
 * Removes Barefoot.View from this view (if present as subview) and sets the
 * former subviews parentView property to undefined.
 *
 * Parameters:
 *     (Barefoot.View) subview
 */
function removeSubview(subview) {
	subview.close();

	if(this.subviews) {
		this.subviews = _.without(this.subviews, subview);
	}

	subview.parentView = undefined;
}

/** Function: renderSubviews
 * Iterates each present subview of this view and renders it to the DOM. Ensures
 * that all events of the subviews are bind to the DOM.
 *
 * Attention:
 * Do not call this method on your own. Backbone.View.Shared.render does call
 * this method automatically when its needed.
 */
function renderSubviews() {
	var self = this;

	_.each(self.subviews, function(subview) {
		subview.$ = self.$;
		subview.$el = self.$(subview.el);

		subview.render.call(subview);
		subview.delegateEvents();
	});
}

/** Function: render
 * Overwrites the default Backbone.View.render method. This version
 * automatically calls Barefoot.View.renderView and
 * Barefoot.View.Shared.renderSubviews.
 *
 * Attention:
 * Do not overwrite this method as you are used to from "normal" Backbone view
 * implementations. Create a renderView method in your view instead!
 *
 * See also:
 *     - Barefoo.View.Shared.renderSubviews
 */
function render() {
	if(!_.isUndefined(this.renderView)) {
		this.renderView();
	}
	this.renderSubviews();
}

module.exports = {
	addSubview: addSubview
	, renderSubviews: renderSubviews
	, render: render
};