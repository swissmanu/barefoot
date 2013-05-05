/** Class: Barefoot.View
 * The barefoot view extends the default backbone view by applying an
 * environment specific mixin to it.
 *
 * For further information, please refer to the regarding environment specific
 * mixins.
*
 * Environment Specific Mixins:
 *     - <Barefoot.View.Client>
 *     - <Barefoot.View.Server>
 *
 * Example View Implementation:
 *
 * > var MainView = Barefoot.View.extend({
 * >     el: 'body'
 * >     , initialize: function() {
 * >         this.addSubview(new NavigationView());
 * >     }
 * >     , template: '<header><h1>Application</h1><nav></nav></header>'
 * >               + '<section id="main"></section>';
 * >     , renderView: function() {
 * >         this.$el.html(this.template);
 * >     }
 * >     , events: {
 * >         'click h1': 'onClickTitle'
 * >     }
 * >     , onClickTitle: function onClickTitle(e) {
 * >         console.log('Yay! Title clicked.')
 * >     }
 * > });
 * The following sections discuss specific aspects/differences of this code
 * snippet in comparison to a common Backbone application.
 *
 * Where's the render() function?:
 * Working with <Barefoot.View>, you should never implement a render function.
 * Instead, do everything you'd do there inside of the *renderView* function.
 * Barefoot overwrites backbones render() with its own version
 * (see <Barefoot.View.Shared.render>) to accomplish hassle free view 
 * rendering, both on client and server.
 *
 * Subviews/Nested Views:
 * You may be used to create your views subviews directly in the render 
 * function and call their render function there.
 *
 * Barefoot supports you by providing the <addSubview> and <removeSubview>
 * functions. Use these functions inside the initialization function of your
 * view.
 *
 * Managing subviews this way brings a few improvements:
 * * Barefoot can render views on its own on the server and the browser client
 * * You do not take care of destroying your view hiearchy when rendering a new
 *   view. Barefoot will handle this for you. (No more Zombies)
 *
 * Attention:
 * Please be aware you are not overwriting the <renderSubviews> and <render>
 * method. This would break barefoots rendering mechanisms on the server and
 * client.
 */
var _ = require('underscore')
	, Backbone = require('backbone');


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
	var self = this
		,$ = self.$;

	_.each(self.subviews, function(subview) {
		subview.$ = $;
		subview.$el = subview.selectDOMElement($);

		subview.render.call(subview);
		subview.delegateEvents();
	});
}

/** Function: render
 * Overwrites the default Backbone.View.render method. It automatically
 * invokes "renderView" and <renderSubviews>.
 *
 * If you define a beforeRender or afterRender function in your <View>
 * implementation, that function will be called before/after the actual
 * rendering takes/took place.
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
	if(!_.isUndefined(this.beforeRender)) {
		this.beforeRender();
	}

	if(!_.isUndefined(this.renderView)) {
		this.renderView();
	}

	if(!_.isUndefined(this.afterRender)) {
		this.afterRender();
	}

	this.renderSubviews();
}

/** Function: selectDOMElement
 * Tries to select a DOM element for this <View> using the passed DOM
 * manipulator that confirms to the jQuery API (http://api.jquery.com/).
 *
 * Parameter:
 *     (Object) $ - A DOM manipulator that confirms to the jQuery API
 *
 * Results:
 *     (Object)
 */
function selectDOMElement($) {
	var domElement;

	if (!this.el) {
		var attrs = _.extend({}, _.result(this, 'attributes'));
		if (this.id) { attrs.id = _.result(this, 'id'); }
		if (this.className) { attrs['class'] = _.result(this, 'className'); }

		var selector = '<' + _.result(this, 'tagName') + '>';
		domElement = $(selector).attr(attrs);
	} else {
		domElement = $(_.result(this, 'el'));
	}

	return domElement;
}


var View = Backbone.View.extend();
View.prototype.selectDOMElement = selectDOMElement;
View.prototype.addSubview = addSubview;
View.prototype.removeSubview = removeSubview;
View.prototype.renderSubviews = renderSubviews;
View.prototype.render = render;

module.exports = function applyMixin(mixin) {
	_.extend(View.prototype, mixin);
	return View;
};