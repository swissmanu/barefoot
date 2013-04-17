/** Mixin: Barefoot.View.Shared
 * This mixin contains shared code fragments which are valid for the client as
 * also the server part of barefoot.
 * It extends the plain Backbone.View with the ability to add subviews in 
 * generic manner. Further new render methods for rendering the current view and
 * its subview are introduced.
 *
 * Attention:
 * Please be aware you are not overwriting the <renderSubviews> and <render>
 * method. This would break barefoots rendering mechanisms on the server and
 * client.
 *
 * See also:
 * * <Barefoot.View>
 */
var _ = require('underscore');

/** Function: addSubview
 * Adds a Barefoot.View as subview of this view. Sets the parentView property
 * of the subview to this view.
 *
 * Parameters:
 *     (Barefoot.View) subview - <Barefoot.View> to add as subview to this view
 */
function addSubview(subview) {
	if(_.isUndefined(this.subviews)) {
		this.subviews = [];
	}

	subview.parentView = this;
	this.subviews.push(subview);
}

/** Function: removeSubview
 * Removes <Barefoot.View> from this view (if present as subview) and sets the
 * former subviews parentView property to undefined.
 *
 * Parameters:
 *     (Barefoot.View) subview - A <Barefoot.View> sbuview to remove from this
 *                               view
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
 * *Do never* call this method on your own. <Barefoot.View.Shared.render> 
 * invoces this method automatically when needed.
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
 * Overwrites the default Backbone.View.render method. It automatically
 * invokes "renderView" and <renderSubviews>.
 *
 * If your concrete view object does not implement a renderView function, an
 * error will be generated. So please do implement one ;)
 *
 * Attention:
 * * Do *not* overwrite this method as you are used to from "normal" Backbone
 *   view implementations. Create a *renderView* method in your view instead!
 * * Make sure you implement a renderView() function for your concrete
 *   view.
 *
 * See also:
 * * <renderSubviews>
 */
function render() {
	if(!_.isUndefined(this.renderView)) {
		this.renderView();
	} else {
		throw new Error('No renderView() method found in view', this);
	}
	this.renderSubviews();
}

module.exports = {
	addSubview: addSubview
	, removeSubview: removeSubview
	, renderSubviews: renderSubviews
	, render: render
};