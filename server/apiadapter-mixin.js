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
	, path = require('path');

/** PrivateFunction: createPlainRoutes
 * Creates Express.JS request handlers which do not evaluate any content of the
 * requests body.
 *
 * It takes an object containing route URI's like "/contacts" or
 * "/contacts/:name" as key and callback functions as values.
 * Using the passed Express.JS route-creation-function "binder" (app.get, 
 * app.delete etc.), an Express.JS route is created.
 * 
 * Each route callback is wrapped into an Express.JS specific handler function
 * connected to the route URI. If your route defines any parameters
 * ("/contacts/:id"), the specific values are passed as function arguments. If
 * the request specifies any query parameters ("/contacts?message=test&limit=1")
 * , you'll find an object literal containing all these key-value pairs at the
 * end of your callback arguments list.
 *
 * Beside the return value of the callback, the wrapper function sends 
 * automatically an HTTP OK (200) to the request creator. If the callback throws
 * an error object, that object is inspected for an "httpStatusCode" property.
 * If present, that status code is delivered to the requestor. If not, an HTTP
 * Internal Server Error (500) is sent.
 *
 * For a set of errors with predefined HTTP status codes, see <Barefoot.Errors>.
 *
 * Route & Callback Examples:
 * > // "/contacts" would return the complete array with contacts
 * > '/contacts': function() {
 * >     return [ { name: 'Bob' }, { name: 'Alice' } ];
 * > }
 *
 * > // "/contacts/1" would return { name: 'Alice' }
 * > '/contacts/:id': function(id) {
 * >     return [ { name: 'Bob' }, { name: 'Alice' } ][id];
 * > }
 *
 * > // "/contacts/1?message=test" would return { name: 'Alice' } and print
 * > // "test" on the console
 * > '/contacts/:id': function(id, query) {
 * >     console.log(query.message);
 * >     return [ { name: 'Bob' }, { name: 'Alice' } ][id];
 * > }
 *
 * Parameters:
 *     (Object) routes - Routes to bind
 *     (Function) binder - A function of the Express.JS app like app.get etc.
 *     (Object) app -  The Express.JS app
 *
 * See also:
 * * <createContentRoutes>
 */
function createPlainRoutes(routes, binder, app) {
	var self = this;

	_.map(routes, function(callback, uri) {
		var apiUri = self.prepareAPIUri(uri);

		binder.call(app, apiUri, function(req, res) {
			try {
				var args = _.union(
					_.values(req.params)
					, req.query
				);

				var apiResult = callback.apply(this, args);
				res.send(200, apiResult);
			} catch(err) {
				if(_.has(err, 'httpStatusCode')) {
					res.send(err.httpStatusCode);
				} else {
					res.send(500);
				}
			}
		});
	});
}

/** PrivateFunction: createContentRoutes
 * Creates Express.JS request handlers which read content of the requests body.
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
 * Route & Callback Examples:
 * > // Create a new contact with a POST to "/contacts". The contact argument
 * > // will contain the JSON body from the request.
 * > '/contacts': function(contact) {
 * >     this.contacts.push(contact);
 * >     return contact;
 * > }
 *
 * > // Update an existing contact at "/contacts/1" with the information from
 * > // the request body. Again, contact contains the body content.
 * > '/contacts/:id': function(id, contact) {
 * >     this.contacts[id] = contact;
 * >     return contact;
 * > }
 *
 * > // Update an existing contact at "/contacts/1?message=test" with the
 * > // information from the request body. Again, contact contains the body
 * > // content. Since the request URL contains query parameters, the last
 * > // query argument will contain these key-value-pairs.
 * > '/contacts/:id': function(id, contact, query) {
 * >     console.log(query.message);
 * >     this.contacts[id] = contact;
 * >     return contact;
 * > }
 *
 * Parameters:
 *     (Object) routes - Routes to bind
 *     (Function) binder - A function of the Express.JS app like app.get etc.
 *     (Object) app -  The Express.JS app
 *
 * See also:
 * * <createPlainRoutes>
 * * <Barefoot.Errors>
 */
function createContentRoutes(routes, binder, app) {
	var self = this;

	_.map(routes, function(callback, uri) {
		var apiUri = self.prepareAPIUri(uri);

		binder.call(app, apiUri, function(req, res) {
			try {
				var args = _.union(
						_.values(req.params)
						, req.body
						, req.query
					);

				var apiResult = callback.apply(this, args);
				res.send(200, apiResult);
			} catch(err) {
				if(_.has(err, 'httpStatusCode')) {
					res.send(err.httpStatusCode);
				} else {
					res.send(500);
				}
			}
		});
	});
}

/** Function: prepareAPIUri
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
function prepareAPIUri(routeUri) {
	var prefix = '/api';
	if(_.has(this, 'apiPrefix')) { prefix = this.apiPrefix; }

	return path.join(prefix, routeUri);
}

/** Function: bindRoutes
 * Inspects the apiRoutes property of this <APIAdapter> and uses
 * <createPlainRoutes> and <createContentRoutes> for the creation of Express.JS
 * routes.
 */
function bindRoutes() {
	createPlainRoutes.call(
		this, this.apiRoutes.get, this.app.get, this.app
	);
	createContentRoutes.call(
		this, this.apiRoutes.post, this.app.post,this.app
	);
	createContentRoutes.call(
		this, this.apiRoutes.put, this.app.put, this.app
	);
	createContentRoutes.call(
		this, this.apiRoutes.patch, this.app.patch, this.app
	);
	createPlainRoutes.call(
		this, this.apiRoutes.del, this.app.del, this.app
	);
}

module.exports = {
	prepareAPIUri: prepareAPIUri
	, bindRoutes: bindRoutes
};