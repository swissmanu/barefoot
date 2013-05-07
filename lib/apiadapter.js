/** Class: Barefoot.APIAdapter
 * When building a fancy JavaScript based client you'll probably have a straight
 * forward REST API in the backend. In reality, Backbone builds heavily on this
 * architectural pattern and allows you to bind any model or collection to a
 * RESTful web service using JSON as data transfer format.
 *
 * Taking this architecture it comes clear that you need some code for your
 * web service on the server which delivers your data and takes fresh data from
 * the client. Now the most common way could be a simple Express.JS app
 * implementation where you hard-code every REST resource. Since barefoot makes
 * it easy to render your backbone views on the server, which probably will run
 * your API too, this would not work quite satisfying anymore, right?
 *
 * Thats the point where APIAdapter joins the game: It binds a bunch of API 
 * resources (actually just independant callback functions, each identified with
 * a unique URI) and wraps it into Express.JS routes to make them available to
 * the clients. During startup (<Barefoot.Startup.Server>), backbones sync
 * function is automatically replaced with barefoots one to ensure that local
 * API calls on the server are routed directly to the callbacks instead going 
 * a detour via HTTP/AJAX. For further details, have a look into APIAdapters
 * server mixin: <Barefoot.APIAdapter.Server>.
 *
 * You will probably touch the APIAdapter consciously only once: In your app
 * factory on the server, you have to specify your desired API resources.
 * Everything else will run behind the curtains afterwards.
 *
 * Example API Routes:
 *
 * > var contacts = [ { 'name': 'Bob' }, { 'name': 'Alice' } ];
 * > var apiRoutes = {
 * >     'get': {
 * >         '/contacts': function() {
 * >             return contacts;
 * >         }
 * >     }
 * >     , 'post': {
 * >         '/contacts': function(contact) {
 * >             contacts.push(contact);
 * >         }
 * >     }
 * >  };
 *
 * For more examples, see <Barefoot.APIAdapter.Server.createPlainRoutes> and
 * <Barefoot.APIAdapter.Server.createContentRoutes>.
 */
var _ = require('underscore')
	, Backbone = require('backbone');

var APIAdapter = function(options) {
	if(_.isUndefined(options)) { options = {}; }
	if(this.preInitialize) { this.preInitialize(arguments); }
	if(options.app) { this.app = options.app; }

	this.createRouteFactories.call(this);
	this.initialize.apply(this, arguments);
};

// To make APIAdapter looking and behave like any backbone object, kidnap the
// extend function from any other Backbone object. Does not harm anyone :)
APIAdapter.extend = Backbone.Model.extend;

_.extend(APIAdapter.prototype, Backbone.Events, {
	initialize: function initialize() { }
});

function applyMixin(mixin) {
	_.extend(APIAdapter.prototype, mixin);

	return APIAdapter;
}

module.exports = applyMixin;