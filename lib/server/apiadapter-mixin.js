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
	, path = require('path')
	, httpMethods = require('methods')
	, methodMap = {
		'create': 'post'
		, 'update': 'put'
		, 'patch': 'patch'
		, 'delete': 'delete'
		, 'read': 'get'
	};


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
 * <createPlainRoutes> and <createContentRoutes> creates each a special scope
 * object which provides access to the express.js app, the current request as
 * also the current response object.
 *
 * Route & Callback Examples:
 * > // Create a new contact with a POST to "/contacts". The contact argument
 * > // will contain the JSON body from the request.
 * > '/contacts': function(success, error, contact) {
 * >     this.contacts.push(contact);
 * >     success(contact);
 * > }
 *
 * > // Update an existing contact at "/contacts/1" with the information from
 * > // the request body. Again, contact contains the body content.
 * > '/contacts/:id': function(id, contact) {
 * >     this.contacts[id] = contact;
 * >     success(contact);
 * > }
 *
 * > // Update an existing contact at "/contacts/1?message=test" with the
 * > // information from the request body. Again, contact contains the body
 * > // content. Since the request URL contains query parameters, the last
 * > // query argument will contain these key-value-pairs.
 * > '/contacts/:id': function(id, contact, query) {
 * >     console.log(query.message);
 * >     this.contacts[id] = contact;
 * >     success(contact);
 * > }
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
	expressJsMethod.call(app, url, function(req, res) {
		var context = {
			app: req.app
			, req: req
		}
		, success = function success(apiResult, httpStatusCode) {
			httpStatusCode = httpStatusCode || 200;
			res.send(httpStatusCode, apiResult);
		}
		, error = function error(err) {
			if(_.has(err, 'httpStatusCode')) {
				res.send(err.httpStatusCode);
			} else {
				res.send(500);
			}
		}
		, args = _.union(
			success
			, error
			, _.values(req.params)
			, req.body
			, req.query
		);

		try {
			callback.apply(context, args);
		} catch(err) {
			error(err);
		}
	});
}

/** PrivateFunction: getAPIPrefix
 * If set, returns the specific apiPrefix property of this <APIAdapter>.
 * Otherwise the default "/api" prefix gets returned.
 *
 * Returns:
 *     (String) prefix for the api route urls
 */
function getAPIPrefix() {
	return this.apiPrefix || '/api';
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
	var apiUrl = this.prepareAPIUrl(url)
		, urlParamKeys = []
		, regexp = urlRegexp(url, urlParamKeys, true, true);

	if(_.isUndefined(this.apiRoutes)) { this.apiRoutes = {}; }
	if(_.isUndefined(this.apiRoutes[method])) { this.apiRoutes[method] = {}; }

	createExpressJsRoute.call(
		this, apiUrl, callback, this.app[method], this.app
	);

	this.apiRoutes[method][apiUrl] = {
		callback: callback
		, regexp: regexp
		, keys: urlParamKeys
	};
}

/** Function: prepareAPIUrl
 * Prepends an API route URI with a prefix. If no apiPrefix property is defined
 * for this <APIAdapter>, the prefix is "/api" by default.
 *
 * Following this, "/contacts" will become "/api/contacts".
 *
 * Parameters:
 *     (String) routeUri - The API route to prepare
 *
 * Returns:
 *     (String) the routeUri with a prefix.
 */
function prepareAPIUrl(routeUri) {
	var apiPrefix = getAPIPrefix();
	return path.join(apiPrefix, routeUri);
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

/** Function: sync
 * This is the core where server side API callbacks are dispatched. This 
 * function replaces Backbone.sync and gets in place during startup
 * (<Barefoot.Startup.Server>).
 *
 * Instead going the detour over an AJAX request, this implementation of sync
 * calls the API callback directly by resolving the models url with the present
 * apiRoutes.
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
		, apiPrefix = getAPIPrefix()
		, httpMethod = methodMap[method];

	if(_.isUndefined(url)) {
		throw new Error('No url present for syncing!', model, options);
	}

	if(url.substr(0, apiPrefix.length) === apiPrefix) {
		url = url.substr(apiPrefix.length);
	}

	var params = {}
		, matchedRoute = matchRoute(httpMethod, url, this.apiRoutes, params);

	if(_.isUndefined(matchedRoute)) {
		throw new Error('Could not resolve API route: ' + url);
	}

	var success = function success(apiResult) {
			if(options.success) { options.success(apiResult); }
		}
		, error = function error(err) {
			if(options.error) { options.error(err); }
		}
		, args = _.union(success, error, _.values(params));

	try {
		matchedRoute.callback.apply(this, args);
	} catch(err) {
		error(err);
	}
}

module.exports = {
	createRouteFactories: createRouteFactories
	, prepareAPIUrl: prepareAPIUrl
	, sync: sync
};