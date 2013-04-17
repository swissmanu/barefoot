/** Mixin: Barefoot.View.Client
 * This mixin contains client specific code for the Barefoot.View class.
 * Mainly code for view hierarchy restoration and clean up of view zombies is
 * contained.
 *
 * See also:
 * * <Barefoot.View>
 * * <Barefoot.View.Shared>
 * * <Barefoot.Router.Client>
 */
var _ = require('underscore');

/** Function: delegateEventsOnSubviews
 * Binds all defined events of this view. In addition, all present subviews
 * are iterated and a recusive call on delegateEventsOnSubviews is done.
 *
 * This method is a core part of the view object restoration when receiving 
 * an already rendered UI from the server.
 */
function delegateEventsOnSubviews() {
	this.delegateEvents();
	
	if(!_.isUndefined(this.subviews)) {
		_.each(this.subviews, function(subview) {
			subview.delegateEventsOnSubviews();
		});
	}
}

/** Function: close
 * Removes a view from the DOM and ensures that all events of the view itself
 * and its subviews are removed too. Kill aaaaall the zombies, aarrrrrr.
 *
 * See also:
 * * <Barefoot.Router.Client.render>
 */
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
	, close: close
};