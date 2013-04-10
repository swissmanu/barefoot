var Backbone = require('backbone')
	, _ = require('underscore')
	, path = require('path')
	, environmentSpecific = requireEnvironmentSpecific();


var MonkeyRouter = function(options) {
	if(!_.isUndefined(this.preInitialize)) {
		this.preInitialize(options);
	}

	return Backbone.Router.call(this, options);
}
_.extend(MonkeyRouter, Backbone.Router);
_.extend(MonkeyRouter.prototype, Backbone.Router.prototype);


var Router = MonkeyRouter.extend({
	renderedViews: {}
});

_.extend(Router.prototype, environmentSpecific.RouterMixin);


var View = Backbone.View.extend({
	subviews: []
});
_.extend(View.prototype, environmentSpecific.ViewMixin);


/** Function: start
 * Starts your application using the given router.
 *
 * Parameters:
 *     (Barefoot.Router) Router
 */
function start(Router) {
	environmentSpecific.startup(Router);
}



module.exports = {
	Router: Router
	, View: View
	, start: start
};



/** PrivateFunction: mergeObjectProperties
 * This function takes two objects and uses underscores extend function to
 * merge each object contained inside of them.
 *
 * > var A = { person: { name: 'Fritz' } };
 * > var B = { person: { surname: 'Fritzenson' }, city: 'Fritzhausen' };
 * > var merged = mergeObjectProperties(A, B);
 * > // { person: { name: 'Fritz', surname: 'Fritzenson' }, city: 'Fritzhausen'}
 *
 * Parameters:
 *     (Object) objectA
 *     (Object) objectB
 *
 * Returns:
 *     (Object) merged
 */
function mergeObjectProperties(objectA, objectB) {
	var keys = _.keys(objectA);

	_.each(keys, function(key) {
		if(_.has(objectA, key)) {
			_.extend(objectA[key], objectB[key]);
		} else {
			objectA[key] = objectB[key];
		}
	});

	return objectA;
}

/** PrivateFunction: requireEnvironmentSpecific
 * Since Barefoot is runnable on server or client, this function returns the
 * correct backbone customizations for each of these environments.
 * If there is code available which is used in both environments, these
 * fragments are merged with the specific ones.
 *
 * Returns:
 *     (Object) - the actual, environment specific module
 */
function requireEnvironmentSpecific() {
	var specific
		, shared = require('./shared');

	if(process.browser) {
		specific = require('./client');
	} else {
		specific = require('./server');
	}

	if(!_.isUndefined(shared) && !_.isUndefined(specific)) {
		specific = mergeObjectProperties(specific, shared);
	} else if(!_.isUndefined(shared) && _.isUndefined(specific)) {
		specific = shared;
	}

	return specific;
}
