/** Class: Barefoot.Router
 * The barefoot router extends the default backbone router by applying 
 * environment specific mixins to it 
 *
 * For further information, please refer to the regarding environment specific
 * mixins.
 *
 * Environment Specific Mixins:
 * * <Barefoot.Router.Client>
 * * <Barefoot.Router.Server>
 *
 * Example Router Implementation:
 *
 * > var ExampleRouter = Barefoot.Router.extend({
 * >     routes: {
 * >         '': 'home'
 * >         , 'about': 'about'
 * >     }
 * >     , home: function home() {
 * >         this.render(new HomeView());
 * >     }
 * >     , home: function home() {
 * >         this.render(new HomeView());
 * >     }
 * >     , mainView: function() {
 * >         if(_.isUndefined(this._mainView)) {
 * >             this._mainView = new ChromeView();
 * >         }
 * >         return this._mainView;
 * >     }
 * > });
 * The following sections discuss specific aspects/differences of this code
 * snippet in comparison to a common Backbone application.
 *
 * Introduction of Barefoot.Router.render:
 * If you want barefoot to render a view for you, do *never* call the 
 * <Barefoot.View> render function on yourself. Make sure you use the render
 * function which is provided from <Barefoot.Router> (In the example: 
 * "this.render(new HomeView());").
 * This way ensures that the view is rendered properly on the server but also
 * on the client side.
 *
 * The Main View:
 * You have the option to define a "main view". Understand this as a 
 * <Barefoot.View> object which contains all common view objects like
 * navigation bars, footer etc.
 * If present in a <Barefoot.Router>, this view gets automatically rendered
 * before any other view.
 */

var _ = require('underscore')
	, Backbone = require('backbone');

/* createBackboneRouterWithPreInitialize
 * Creates a backbone router which tries to call a preInitialize method before
 * calling the actual initialize().
 *
 * Further Information:
 * The constructor of the default backbone router looks like the following:
 *
 * > var Router = Backbone.Router = function(options) {
 * >   options || (options = {});
 * >    if (options.routes) this.routes = options.routes;
 * >   this._bindRoutes();
 * >   this.initialize.apply(this, arguments);
 * > };
 *
 * This means, initialize() is called after the actual routes were bound to
 * their specific callbacks.
 * With the introduction of preInitialize() it becomes possible to evaluate
 * the option object before any route gets bound.
 * The <Barefoot.Router.Server> makes use of this to inject various variables
 * which are needed to create the defined routes inside an Express.JS app.
 *
 * Returns:
 *     A monkey patched version of Backbone.Router with preInitialize capability
 *
 * See also:
 *     - <Barefoot.Router.Server.preInitialize>
 */
function createBackboneRouterWithPreInitialize() {
	var MonkeyRouter = function(options) {
		if(!_.isUndefined(this.preInitialize)) {
			this.preInitialize(options);
		}

		return Backbone.Router.call(this, options);
	};
	_.extend(MonkeyRouter, Backbone.Router);
	_.extend(MonkeyRouter.prototype, Backbone.Router.prototype);

	return MonkeyRouter;
}

/* applyMixin
 * Applies a mixin to the given parameter by using underscores extend function.
 *
 * Parameters:
 *     (Barefoot.Router) backboneRouter - The router to apply the mixin
 *     (Object) - The mixin to apply
 *
 * Returns:
 *     A router object with the given mixin applied.
 */
function applyMixin(backboneRouter, mixin) {
	var Router = backboneRouter.extend({});
	_.extend(Router.prototype, mixin);
	return Router;
}

/* exporter
 * A shortcut function which calls <createBackboneRouterWithPreInitialize> and
 * <applyMixin>.
 * This function is exported via "module.exports".
 *
 * Parameters:
 *     (Object) mixin - An environment specific mixin for the Barefoot.Router
 *
 * Returns:
 *      <Barefoot.Router>
 *
 * See also:
 *     - <Barefoot>
 */
function exporter(mixin) {
	var backboneRouter = createBackboneRouterWithPreInitialize()
		, barefootRouter = applyMixin(backboneRouter, mixin);

	return barefootRouter;
}

module.exports = exporter;