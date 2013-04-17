/** Class: Barefoot.Util
 * Contains helper functions for loading environment specific mixins.
 *
 * Please notice:
 * This utilities are only available inside of barefoot.
 */
var _ = require('underscore');

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
 *     A merged object
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

/** Function: loadMixins
 * Since Barefoot is runnable on server and client, this function returns 
 * environment specific code read from the "server", "client" and "shared"
 * folders.
 * 
 * If there is shared code available these it gets merged with the specific
 * ones.
 *
 * Returns:
 *     A mixin to give a Backbone object barefoot capabilities.
 */
function loadMixins() {
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

module.exports = {
	loadMixins: loadMixins
};