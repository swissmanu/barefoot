/** Mixin: Barefoot.APIAdapter.Server
 * The server mixin for the <APIAdapter> takes the specified apiRoutes and does
 * two things:
 * * Create RESTful API routes with Express.JS, callable via HTTP
 * * Map server-side API calls to the correct local callback
 *
 * The creation of the Express.JS routes is done on initialization. The mapping
 * of server-side API calls is executed during runtime.
 *
 * Function Mapping:
 * The following matrix describes which function of <APIAdapter.Server> is
 * related to which task:
 *
 * >                          + REST API + Local API +
 * > +------------------------+----------+-----------+
 * >  processCallbacks        |    X     |     X     |
 * >  createExpressJsCallback |    X     |           |
 * >  createExpressJsRoute    |    X     |           |
 * >  urlRegexp               |          |     X     |
 * >  matchRoute              |          |     X     |
 * >  addRoute                |    X     |     X     |
 * >  createRouteFactories    |    X     |     X     |
 * >  dispatchLocalApiCall    |          |     X     |
 * >  sync                    |          |     X     |
 * > +------------------------+----------+-----------+
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

/** PrivateFunction: processCallbacks
 * This function is used to run a callback function or an array of stacked
 * callback functions which are registered for an API route.
 *
 * Parameters:
 *     (Object) namedRouteParameters - If a route contains named parameters
 *                                     (stuff like ":id", ":name"), this object
 *                                     should contain these values. They are
 *                                     passed as arguments to each callback
 *                                     function.
 *     (Object) data - The data argument contains any larger data amount. Stuff
 *                     like the body of a POST request in example.
 *     (Object) req - ExpressJS request object is needed for creating scope
 *                    objects for callback execution
 *     (Object) res - ExpressJS response object is needed for creating the scope
 *                    object for calling the handler functions.
 *     (Function) successHandler - A function which is injected as the first
 *                                 argument when executing the callback
 *     (Function) errorHandler - A function which is injected as the second
 *                                 argument when executing the callback
 *     (Function)/(Array) callbacks - An API function which should be executed.
 *                                    If you pass an array with functions, each
 *                                    function gets executed as it is stacked
 *                                    upon the array. Calling success will
 *                                    proceed, error will stop execution.
 *                                    Make sure you call one of them or your
 *                                    code will go nuts.
 */
function processCallbacks(namedRouteParameters, data, req, res, successHandler
	, errorHandler, callbacks) {

	var callbackScope = {
			app: req.app
			, req: req
		}
		, handlerScope = {
			app: req.app
			, req: req
			, res: res
		}
		, callbackArguments = _.union(
			successHandler.bind(handlerScope)
			, errorHandler.bind(handlerScope)
			, namedRouteParameters
			, data
		)
		, index = -1
		, executeCallback = function executeCallback(callback) {
			callback.apply(callbackScope, callbackArguments);
		}
		, runner;

	if(!_.isArray(callbacks)) {
		runner = function() { executeCallback(callbacks); };
	} else {
		var finalSuccessHandler = callbackArguments[0]
			, stackedSuccessHandler = function stackedSuccessHandler() {
				index += 1;

				if(index < callbacks.length) {
					executeCallback(callbacks[index]);
				} else {
					finalSuccessHandler.apply(handlerScope, arguments);
				}
			};

		callbackArguments[0] = stackedSuccessHandler;
		runner = stackedSuccessHandler;
	}

	try {
		runner();
	} catch(err) {
		winston.log('error', 'API callback caused exceptional error', {
					source: toString()
					, apiRoute: req.originalUrl
					, err: err.toString() || err
					, stack: err.stack || undefined
				});
		errorHandler.call(handlerScope, err);
	}
}

/** Function: createExpressJsCallback
 * Encapsulates given callback function or an array with stacked callback
 * functions and prepares it so it can be registered as an express js route.
 *
 * The two functions successHandler and errorHandler are passed to the callback
 * on runtime as the first two arguments.
 *
 * Parameters:
 *     (Function) successHandler - A function which is injected as the first
 *                                 argument when executing the callback
 *     (Function) errorHandler - A function which is injected as the second
 *                                 argument when executing the callback
 *     (Function)/(Array) callbacks - An API function which should be executed.
 *                                    If you pass an array with functions, each
 *                                    function gets executed as it is stacked
 *                                    upon the array.
 *
 * Returns:
 *     (Function) to be registered with express js.
 *
 * See also:
 * * <processCallbacks>
 */
function createExpressJsCallback(successHandler, errorHandler, callbacks) {
	return function handler(req, res) {
		processCallbacks(
			_.values(req.params)
			, req.body
			, req
			, res
			, successHandler
			, errorHandler
			, callbacks);
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
 * Parameters:
 *     (Object) url - URL route to bind
 *     (Function)/(Array) callbacks - An API function which should be executed.
 *                                    If you pass an array with functions, each
 *                                    function gets executed as it is stacked
 *                                    upon the array.
 *     (Function) expressJsMethod - A function of Express.JS like app.get etc.
 *     (Object) app -  The Express.JS app
 *
 * See also:
 * * <Barefoot.Errors>
 */
function createExpressJsRoute(url, callbacks, expressJsMethod, app) {
	var self = this
		, expressJsHandler = createExpressJsCallback(
			function success(apiResult, httpStatusCode) {
				httpStatusCode = httpStatusCode || 200;
				this.res.send(httpStatusCode, apiResult);
			}
			, function error(err) {
				var message
					, stack
					, httpStatusCode = 500;

				if(!_.isUndefined(err)) {
					if(_.has(err, 'httpStatusCode')) {
						httpStatusCode = err.httpStatusCode;
					}
					message = err.toString() || err;
					stack = err.stack || undefined;
				}

				this.res.send(httpStatusCode, message);
				winston.log('error', 'API callback stopped with error', {
					source: self.toString()
					, apiRoute: url
					, err: message
					, stack: stack
				});
			}
			, callbacks
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


/** PrivateFunction: extractParams
 * Takes a match object of a regex execution and extracts the parameters
 * identified by keys. All values are returned inside an array at the end.
 *
 * Thanks to:
 * * https://github.com/visionmedia/express/blob/master/lib/router/route.js#L50
 * Paremters:
 *     (Object) match - Resulting match object of an executed Regexp
 *     (Object) keys - Keys to extract
 *     (Object) params - An object which will contain all extracted parameters
 *                       from url, if a route matched.
 */
function extractParams(match, keys, params) {
	params = params || {};

	for(var i = 1, l = match.length; i < l; ++i) {
		var key = keys[i - 1];
		var val = 'string' === typeof match[i] ?
			decodeURIComponent(match[i]) :
			match[i];

		if(key) {
			params[key.name] = val;
		} else {
			params.push(val);
		}
	}
}

/** PrivateFunction: matchRoute
 * This function takes an HTTP method and a URL. It tries to match any API route
 * contained in apiRoutes. If a route is found, the routes regex is used to
 * extract any parameters from the URL. These parameters are contained in the
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

	for(var routeUrl in routes) {
		var route = routes[routeUrl]
			, keys = route.keys
			, match = route.regexp.exec(url);

		if(match) {
			matchedRoute = route;
			extractParams(match, keys, params);
			break;
		}
	}

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
 *     (Function)/(Array) callbacks - An API function which should be executed.
 *                                    If you pass an array with functions, each
 *                                    function gets executed as it is stacked
 *                                    upon the array.
 */
function addRoute(method, url, callbacks) {
	var urlParamKeys = []
		, regexp = urlRegexp(url, urlParamKeys, true, true);

	if(_.isUndefined(this.apiRoutes)) { this.apiRoutes = {}; }
	if(_.isUndefined(this.apiRoutes[method])) { this.apiRoutes[method] = {}; }

	createExpressJsRoute.call(
		this, url, callbacks, this.app[method], this.app
	);

	this.apiRoutes[method][url] = {
		callback: callbacks
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
 *
 * Example:
 * > apiAdapter.get('/myroute', function myCallback(success) { success(); });
 * > apiAdapter.post('/myroute', function myCallback(success) { success(); });
 * > // any HTTP verb :)
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
 * It tries to match the given URL with a registered route for the given
 * httpMethod. If found, the route callback(s) is/are invoked using
 * <processCallbacks>.
 *
 * If the data argument contains any information, that stuff gets passed to the
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
		if(_.has(options, 'error')) {
			options.error(new Error('Could not resolve API route: ' + url));
		} else {
			winston.log('info', 'Could not resolve API route', {
				source: toString()
				, apiRoute: url
			});
		}
	}

	var successHandler = function successHandler(apiResult) {
			if(_.has(options, 'success')) {
				options.success(apiResult);
			} else {
				winston.log('info', 'No success callback defined', {
					source: self.toString()
					, apiRoute: url
				});
			}
		}
		, errorHandler = function errorHandler(err) {
			var message
				, stack;

			if(!_.isUndefined(err)) {
				message = err.toString() || err;
				stack = err.stack || undefined;
			}

			if(_.has(options, 'error')) {
				options.error(err);
			} else {
				winston.log('info', 'No error callback defined', {
					source: toString()
					, apiRoute: url
				});
			}

			winston.log('error', 'API callback stopped with error', {
				source: self.toString()
				, apiRoute: url
				, err: message
				, stack: stack
			});
		};

	processCallbacks(
		_.values(params)
		, data
		, this.req
		, {}
		, successHandler
		, errorHandler
		, matchedRoute.callback);
}

/** Function: sync
 * During startup on the server, this function replaces Backbones own sync
 * implementation to shortcut "local" API calls.
 *
 * Instead going the detour over an AJAX request, this implementation of sync
 * calls the API callback directly by resolving the models URL with the present
 * apiRoutes.
 *
 * If method is not equal to read or delete, the return value of the toJSON
 * function of the given model is passed to the API callback.
 *
 * Parameters:
 *     (String) method - A method (create, update, patch, delete or read) which
 *                       will be used to resolve the models URL properly.
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