/** Mixin: Barefoot.APIAdapter.Server
 * The server mixin for the <APIAdapter> takes the specified apiRoutes and does
 * two things:
 * * Create Express.JS routes for the client part
 * * Map server-side API calls to the correct callback
 *
 * The creation of the Express.JS routes is done on initalization. The mapping
 * of server-side API calls is executed during runtime.
 */
var _ = require('underscore')
	, winston = require('winston')
	, httpMethods = require('methods')
	, methodMap = {
		'create': 'post'
		, 'update': 'put'
		, 'patch': 'patch'
		, 'delete': 'delete'
		, 'read': 'get'
	};

/** Function: toString
 * String representation of this module.
 */
function toString() {
	return 'APIAdapter.Server';
}

/** Function: createExpressJsCallback
 * Encapsulates given callback function and prepares it so it can be registered
 * as an express js route.
 *
 * The two functions successHandler and errorHandler are passed to the callback
 * on runtime as the first two arguments.
 *
 * Parameters:
 *     (Function) successHandler - A function which is injected as the first
 *                                 argument when executing the callback
 *     (Function) errorHandler - A function which is injected as the second
 *                                 argument when executing the callback
 *     (Function) callback - The actual callback function you want to execute
 *                           for an express js route.
 *
 * Returns:
 *     (Function) to be registered with express js.
 */
function createExpressJsCallback(successHandler, errorHandler, callback) {
	return function handler(req, res) {
		var callbackScope = {
				app: req.app
				, req: req
			}
			, handlerScope = {
				app:req.app
				, req:req
				, res:res
			}
			, args = _.union(
				successHandler.bind(handlerScope)
				, errorHandler.bind(handlerScope)
				, _.values(req.params)
				, req.body
				, req.query
			);

		try {
			callback.apply(callbackScope, args);
		} catch(err) {
			winston.log('error', 'API callback cause exceptional error ' +
				' while being called over the HTTP interface', {
					source: toString()
					, apiRoute: req.originalUrl
					, err: err
				});
			errorHandler.call(handlerScope, err);
		}
	};
}

/** PrivateFunction: createExpressJsRoute
 * Creates an Express.JS request handlers.
 *
 * It takes an object containing route URI's like "/contacts" or
 * "/contacts/:name" as key and callback functions as values.
 * Using the passed Express.JS route-creation-function "binder" (app.post, 
 * app.put etc.), an Express.JS route is created.
 * 
 * Each route callback is wrapped into an Express.JS specific handler function
 * connected to the route URI. Combined with the Express.JS body parser 
 * middleware, the first argument of your callback will contain the body of the
 * request. If your route defines any parameters ("/contacts/:id"), the specific
 * values are passed as function arguments. If the request specifies any query
 * parameters ("/contacts?message=test&limit=1"), you'll find an object literal
 * containing all these key-value pairs at the end of your callback arguments
 * list.
 *
 * Beside the return value of the callback, the wrapper function sends 
 * automatically an HTTP OK (200) to the request creator. If the callback throws
 * an error object, that object is inspected for an "httpStatusCode" property.
 * If present, that status code is delivered to the requestor. If not, an HTTP
 * Internal Server Error (500) is sent.
 *
 * For a set of errors with predefined HTTP status codes, see <Barefoot.Errors>.
 *
 * Scope:
 * <createExpressJsRoute> creates each a special scope object which provides
 * access to the express.js app and the current request object.
 *
 * Parameters:
 *     (Object) routes - Routes to bind
 *     (Function) expressJsMethod - A function of Express.JS like app.get etc.
 *     (Object) app -  The Express.JS app
 *
 * See also:
 * * <Barefoot.Errors>
 */
function createExpressJsRoute(url, callback, expressJsMethod, app) {
	var expressJsHandler = createExpressJsCallback(
		function success(apiResult, httpStatusCode) {
			httpStatusCode = httpStatusCode || 200;
			this.res.send(httpStatusCode, apiResult);
		}
		, function error(err) {
			if(_.has(err, 'httpStatusCode')) {
				this.res.send(err.httpStatusCode);
			} else {
				this.res.send(500);
			}
		}
		, callback
		, app);

	expressJsMethod.call(app, url, expressJsHandler);
}

/** PrivateFunction: urlRegexp
 * Takes a route URL with possible placeholders like "/contacts/:contactid" and
 * prepares a RegEx for later pattern matching when trying to resolve a route
 *
 * Thanks to:
 * * https://github.com/visionmedia/express/blob/master/lib/utils.js#L277
 *
 * Parameters:
 *     (String) url - The url pattern to create the regex of
 *     (Array) keys - An array which will contain all identified placeholder
 *                    names afterwards
 *     (Boolean) sensitive - Create Regex case sensitive?
 *     (Boolean) strict - Create Regex in strict mode?
 *
 * Returns:
 *     (Regexp)
 */
function urlRegexp(url, keys, sensitive, strict) {
	if (url.toString() === '[object RegExp]') { return url; }
	if (Array.isArray(url)) { url = '(' + url.join('|') + ')'; }
	url = url
	.concat(strict ? '' : '/?')
	.replace(/\/\(/g, '(?:/')
		.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(
			_, slash, format, key, capture, optional, star){
				keys.push({ name: key, optional: !! optional });
				slash = slash || '';
				return '' +
					(optional ? '' : slash) +
					'(?:' +
					(optional ? slash : '') +
					(format || '') +
					(capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
					(optional || '') +
					(star ? '(/*)?' : '');
		})
		.replace(/([\/.])/g, '\\$1')
		.replace(/\*/g, '(.*)');

	return new RegExp('^' + url + '$', sensitive ? '' : 'i');
}

/** PrivateFunction: matchRoute
 * This function takes an HTTP method and a URL. It tries to match any API route
 * contained in apiRoutes. If a route is found, the routes regex is used to
 * extract any parameters from the url. These parameters are contained in the
 * params argument afterwards.
 *
 * The actual matched route gets returned if found.
 *
 * Thanks to:
 * * https://github.com/visionmedia/express/blob/master/lib/router/route.js#L50
 *
 * Parameters:
 *     (String) method - An HTTP method verb
 *     (String) url - The URL to match a route for
 *     (Object) apiRoutes - An object containing all api routes too look after
 *     (Object) params - An object which will contain all extracted parameters
 *                       from url, if a route matched.
 *
 * Returns:
 *     (Object) containing all information about the matched api route. Dont
 *              forget that the params argument will contain any extracted
 *              parameters from the url!
 */
function matchRoute(method, url, apiRoutes, params) {
	var routes = apiRoutes[method]
		, matchedRoute;
	params = params || [];

	_.every(routes, function(route) {
		var keys = route.keys
			, m = route.regexp.exec(url);

		if(m) {
			matchedRoute = route;

			for(var i = 1, l = m.length; i < l; ++i) {
				var key = keys[i - 1];
				var val = 'string' === typeof m[i] ?
					decodeURIComponent(m[i]) :
					m[i];

				if(key) {
					params[key.name] = val;
				} else {
					params.push(val);
				}
			}

			return true;
		} else {
			return false;
		}
	});

	return matchedRoute;
}

/** PrivateFunction: addRoute
 * The functions generated by <createRouteFactories> use this function to create
 * an actual api route.
 *
 * To accomplish this, this creates a concrete Express.JS route which can be
 * reached via REST HTTP. To make the route callable locally, it gets saved into
 * the apiRoutes variable.
 *
 * Parameters:
 *     (String) method - The HTTP method for this route
 *     (String) url - The URL for this route. Gets prepared with <prepareAPIUrl>
 *     (Function) callback - The handler for this route
 */
function addRoute(method, url, callback) {
	var urlParamKeys = []
		, regexp = urlRegexp(url, urlParamKeys, true, true);

	if(_.isUndefined(this.apiRoutes)) { this.apiRoutes = {}; }
	if(_.isUndefined(this.apiRoutes[method])) { this.apiRoutes[method] = {}; }

	createExpressJsRoute.call(
		this, url, callback, this.app[method], this.app
	);

	this.apiRoutes[method][url] = {
		callback: callback
		, regexp: regexp
		, keys: urlParamKeys
	};
}

/** Function: createRouteFactories
 * This is called by the constructor of <APIAdapter> and is heavily inspired by
 * the fancy Express.JS Application API.
 *
 * It creates a function for each available HTTP method and makes it available
 * through the <APIAdapter> itself.
 *
 * These functions then can be used to create an APIAdapter route.
 */
function createRouteFactories() {
	var self = this;

	_.each(httpMethods, function(httpMethod) {
		self[httpMethod] = function(url, callback) {
			addRoute.call(self, httpMethod, url, callback);
		};
	});
}

/** Function: dispatchLocalApiCall
 * This is the core where server side API callbacks are dispatched. It is called
 * by Barefoots <sync> replacement.
 *
 * It tries to match the given url with a registered route for the given
 * httpMethod. If found, the route callback is invoked.
 *
 * If the data argument contains any information, that stuf gets passed to the
 * callback. If the options argument contains a success or error element, these
 * functions are called by the callback in case of success or failure.
 *
 * Example Call:
 * > dispatchLocalApiCall('post', '/contacts', { name: foo }, {
 * >     success: function() { console.log('yay!'); }
 * >     , error: function() { console.log('nay :('); }
 * > });
 *
 * Parameters:
 *     (String) httpMethod - An HTTP verb. Necessary to match a registered
 *                           route.
 *     (String) url - The URL of the API callback to dispatch
 *     (Object) data - Optional. Contains information which should be passed to
 *                     the callback. (Example: Contact information which should
 *                     be saved.)
 *     (Object) options - Should contain an error and success callback function.
 */
function dispatchLocalApiCall(httpMethod, url, data, options) {
	var self = this
		, params = {}
		, matchedRoute = matchRoute(httpMethod, url, this.apiRoutes, params);
	options = options || {};

	if(_.isUndefined(matchedRoute)) {
		throw new Error('Could not resolve API route: ' + url);
	}

	var success = function success(apiResult) {
			if(_.has(options, 'success')) {
				options.success(apiResult);
			} else {
				winston.log('info', 'No success callback defined', {
					source: self.toString()
					, apiRoute: url
				});
			}
		}
		, error = function error(err) {
			winston.log('error', 'API callback caused exceptional error ' +
				'while being called locally on the server.', {
					source: toString()
					, apiRoute: url
					, err: err
				});

			if(_.has(options, 'error')) {
				options.error(err);
			} else {
				winston.log('info', 'No error callback defined', {
					source: toString()
					, apiRoute: url
				});
			}
		}
		, args = _.union(
			success
			, error
			, _.values(params)
			, data
		);
	try {
		matchedRoute.callback.apply(this, args);
	} catch(err) {
		error(err);
	}
}

/** Function: sync
 * During startup on the server, this function replaces Backbones own sync
 * implementation to shortcut "local" API calls.
 *
 * Instead going the detour over an AJAX request, this implementation of sync
 * calls the API callback directly by resolving the models url with the present
 * apiRoutes.
 *
 * If method is not equal to read or delete, the return value of the toJSON
 * function of the given model is passed to the API callback.
 *
 * Parameters:
 *     (String) method - A method (create, update, patch, delete or read) which
 *                       will be used to resolve the models url properly.
 *     (Backbone.Model) model - The model which wants to be synced. Can also be
 *                              an instance of Backbone.Collection.
 *     (Object) options - Should contain at least a success callback. Any api
 *                        callback result will be delivered as argument of the
 *                        success function.
 */
function sync(method, model, options) {
	var url = options.url || _.result(model, 'url')
		, httpMethod = methodMap[method]
		, data;

	if(_.isUndefined(url)) {
		throw new Error('No url present for syncing!', model, options);
	}

	if(method !== 'read' && method !== 'delete') {
		data = model.toJSON();
	}

	this.dispatchLocalApiCall(httpMethod, url, data, options);
}

module.exports = {
	createExpressJsCallback: createExpressJsCallback
	, createRouteFactories: createRouteFactories
	, dispatchLocalApiCall: dispatchLocalApiCall
	, sync: sync
	, toString: toString
};